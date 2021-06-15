const AWS = require('aws-sdk')
const { PassThrough, Writable } = require('stream')
const path = require('path')

module.exports = function (options) {
  if (!options.bucket || !options.region) {
    throw new Error('S3 writer requires options.bucket and options.region')
  }

  var s3 = new AWS.S3({
    apiVersion: '2017-08-08',
    region: options.region
  })

  const bucket = options.bucket
  const prefix = options.prefix || ''
  const keyid = options.key
  const queueSize = options.queueSize || 4
  const partSize = options.partSize || 5 * 1024 * 1024

  // let count = 0

  return (fn) => {
    const s3stream = new PassThrough()
    const stream = new Writable({
      write: (chunk, enc, cb) => {
        if (!s3stream.write(chunk, enc)) {
          s3stream.once('drain', cb)
        } else {
          cb()
        }
      },
      final: (cb) => {
        s3stream.end()
        s3stream.once('complete', () => {
          console.debug(`S3 completed ${fn}`)
          cb()
        })
      }
    })

    var params = {
      Bucket: bucket,
      Key: path.join(prefix, fn),
      Body: s3stream
    }

    if (keyid) {
      params.ServerSideEncryption = 'aws:kms'
      params.SSEKMSKeyId = keyid
    }

    if (!options.quiet) {
      console.info(`WRITE S3 URL: s3://${params.Bucket}/${params.Key}`)
    }

    s3.upload(params, {
      queueSize,
      partSize
    })
      // .on('httpUploadProgress', (progress) => {
      //   console.info(progress)
      // })
      .on('error', console.error)
      .promise()
      .then((data) => {
        console.debug('S3 upload stream complete')
        s3stream.emit('complete')
      })
      .catch((err) => {
        console.error(err)
        s3stream.destroy(err)
      })

    return stream
  }
}
