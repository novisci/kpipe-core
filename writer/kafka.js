const { Writable } = require('stream')
const producer = require('../kafka/producer')

const MAX_RETRIES = 15
const MAX_WAITMS = 30000

function backoffTime (retries) {
  return Math.min(Math.pow(2, retries) * 100, MAX_WAITMS)
}

module.exports = function ({ brokers, debug, objectMode, producerOpts, fnKey, quiet }) {
  brokers = brokers || 'localhost:9092'
  objectMode = typeof objectMode === 'undefined' ? false : !!objectMode

  producer.connect({ brokers, debug, ...producerOpts })

  return (topic, partition) => {
    if (!topic) {
      throw Error('topic is required in KafkaProducer.send()')
    }
    (!quiet || debug) && console.info(`WRITE Kafka Topic: ${topic}`)

    const _writeObj = (obj, enc, cb) => {
      if (Buffer.isBuffer(obj)) {
        return cb(Error('Kafka writable stream in object mode does not handle buffers'))
      }

      let key = null
      if (fnKey) {
        // Explicit key extract function supplied
        key = fnKey(obj)
      } else {
        // Key is inferred. Either the first element of an array
        //  or a property of an object named "key"
        if (Array.isArray(obj)) {
          key = obj[0]
        } else if (obj.key) {
          key = obj.key
        }
      }

      let message
      if (typeof obj === 'string') {
        message = Buffer.from(obj)
      } else {
        message = Buffer.from(JSON.stringify(obj))
      }

      let retries = 0
      function send (topic, message, key, partition) {
        producer.connect({ brokers, debug, ...producerOpts }) // Pass through when already connected
          .then(() => producer.send(topic, message, key, partition))
          .then(() => setImmediate(cb))
          .catch((err) => {
            if (err.message === 'timed out') {
              if (retries < MAX_RETRIES) {
                producer.disconnect()
                  .catch((err) => {
                    console.error(err)
                  })
                  .then(() => {
                    setTimeout(() => send(topic, message, key, partition), backoffTime(retries))
                    retries++
                  })
                return
              }
            }
            setImmediate(() => cb(err))
          })
      }
      send(topic, message, key, partition)

      return true
    }

    // const _writeBuf = (message, enc, cb) => {
    //   producer.send(topic, message, null, partition)
    //     .then(() => setImmediate(cb))
    //     .catch((err) => {
    //       // stream.close()
    //       setImmediate(() => cb(err))
    //     })
    // }

    const stream = new Writable({
      objectMode: true,
      write: /* objectMode !== true ? _writeBuf : */ _writeObj,
      final: (cb) => {
        producer.flush().then((stats) => {
          // Object.entries(stats).map((e) => {
          //   console.debug(`${e[0]}: ${e[1].toLocaleString()}`)
          // })
          cb()
        }).catch((err) => cb(err))
      }
    })

    stream.on('error', (err) => {
      console.error('Producer stream error')
      console.error(err)
    })

    return stream
  }
}
