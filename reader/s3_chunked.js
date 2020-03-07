const { Readable } = require('stream')
const AWS = require('aws-sdk')
const path = require('path')
var https = require('https')

const CHUNK_SIZE = 4 * 1024 * 1024

/**
 * Set the maximum number of concurrent S3.getObject chunk downloads (MAX_REQUESTS) and
 *  limit the maximum number of chunks allowed to buffer before the consuming stream
 *  reads them.
 *
 */
const MAX_REQUESTS = 15
const MAX_LOOKAHEAD = MAX_REQUESTS + 5

const MAX_RETRIES = 5
const MAX_WAITMS = 10000

function backoffTime (retries) {
  return Math.min(Math.pow(2, retries) * 100, MAX_WAITMS)
}

function withRetry (fn, params, fnActive = (() => {})) {
  return new Promise((resolve, reject) => {
    let retries = 0
    function request (params) {
      fn(params, (err, data) => {
        // if (Math.floor(Math.random() * 10) < 1) {
        //   err = Error('random failure')
        //   err.statusCode = 500
        // }
        if (err) {
          if (err.statusCode >= 500) {
            console.error(`STATUS ${err.statusCode}: ${err.message}`)
            if (retries < MAX_RETRIES) {
              console.error(`RETRY ${retries}: ${backoffTime(retries)}ms`)
              setTimeout(() => request(params), backoffTime(retries))
              retries++
              return
            }
          }
          return reject(err)
        }
        resolve(data)
      })
        .on('httpHeaders', (status, headers) => {
          fnActive()
        })
    }
    request(params)
  })
}

function getObjectLength (s3, params) {
  return withRetry(s3.headObject.bind(s3), params)
    .then((data) => {
      if (data.AcceptRanges !== 'bytes') {
        return Promise.reject(Error(`Invalid AcceptRanges ${data.AcceptRanges}`))
      }
      return data.ContentLength
    })
}

function getObject (s3, params, fnActive) {
  return withRetry(s3.getObject.bind(s3), params, fnActive)
    .then((data) => data.Body)
}

const makeReq = (off, length) => ({
  start: off,
  end: off + length - 1, // End is inclusive
  active: false,
  content: null,
  request: null
})

function createChunkRequests (length) {
  const reqs = []
  let off = 0
  while (length > 0) {
    if (length < CHUNK_SIZE) {
      reqs.push(makeReq(off, length))
      length = 0
    } else {
      reqs.push(makeReq(off, CHUNK_SIZE))
      length -= CHUNK_SIZE
      off += CHUNK_SIZE
    }
  }
  return reqs
}

module.exports = function (options) {
  if (!options.bucket || !options.region) {
    throw new Error('S3 reader requires options.bucket and options.region')
  }

  var agent = new https.Agent({
    maxSockets: 25
  })

  let s3 = new AWS.S3({
    apiVersion: '2017-08-08',
    region: options.region,
    httpOptions: {
      agent: agent
    }
  })

  const bucket = options.bucket
  const prefix = options.prefix || ''

  return (key) => {
    var params = {
      Bucket: bucket,
      Key: path.join(prefix, key)
    }
    console.info(`READ S3 URL: s3://${params.Bucket}/${params.Key} (CHUNKED)`)

    // let nReqs = 0
    let chunkArray

    function bufferStatus () {
      let str = ''
      chunkArray.forEach((c) => {
        str += c.content ? '#' : (c.request ? (c.active ? '*' : '+') : '-')
      })
      console.debug(str)
    }

    getObjectLength(s3, params)
      .then((length) => {
        stream.emit('notify', {
          type: 'readsize',
          size: BigInt(length)
        })
        chunkArray = createChunkRequests(length)
        console.debug(chunkArray)
        bufferStatus()
        makeNextRequest()
      })
      .catch((e) => stream.emit('error', e))

    function makeRequest (chunk) {
      const p = { ...params }
      p['Range'] = `bytes=${chunk.start}-${chunk.end}`
      console.debug(`Requesting: ${chunk.start}-${chunk.end}`)
      bufferStatus()
      // nReqs++
      chunk.request = getObject(s3, p, () => {
        chunk.active = true
      })
        .then((body) => {
          chunk.content = body
        })
        .catch((e) => stream.emit('error', e))
        .finally(() => {
          // nReqs--
        })
    }

    function makeNextRequest () {
      let i = 0
      let done = chunkArray.length <= MAX_LOOKAHEAD
      let nReqs = 0
      // Inspect the chunk queue and issue requests for unrequested chunks
      for (i = 0; i < chunkArray.length && i < MAX_LOOKAHEAD; i++) {
        const chunk = chunkArray[i]
        if (chunk.request === null) {
          makeRequest(chunk)
          nReqs++
        } else {
          if (chunk.content === null) {
            nReqs++
          }
        }
        if (nReqs >= MAX_REQUESTS) {
          break
        }
      }
      done = done && nReqs === 0
      if (!done) {
        setImmediate(() => makeNextRequest())
      }
    }

    function readNextChunk () {
      if (chunkArray && chunkArray[0].content !== null) {
        const chunk = chunkArray.shift()
        console.debug(`Pushing chunk ${chunk.start} - ${chunk.end}`)
        bufferStatus()
        stream.push(chunk.content)
      } else {
        setImmediate(() => readNextChunk())
      }
    }

    const stream = new Readable({
      objectMode: false,

      read: () => {
        if (chunkArray && chunkArray.length === 0) {
          stream.push(null)
          return
        }
        readNextChunk()
      }
    })

    return require('../stream-tracker')(stream)
  }
}
