import { Writable } from 'stream'
import { StreamGenerator, StreamCb } from '../backend'

const producer = require('../kafka/producer')

type StreamObj = Buffer|string|{ key?: string, [key: string]: any }

type KafkaWriterOpts = {
  brokers?: string
  debug?: boolean
  // objectMode?: boolean
  producerOpts?: { [key: string]: any }
  fnKey?: (msg: StreamObj) => string
}

export default function ({
  brokers = 'localhost:9092',
  debug = false,
  // objectMode = false,
  producerOpts = {},
  fnKey
}: KafkaWriterOpts = {}): StreamGenerator<Writable> {
  producer.connect({ brokers, debug, ...producerOpts })

  return (topic, partition): Writable => {
    if (!topic) {
      throw Error('topic is required in KafkaProducer.send()')
    }
    console.info(`WRITE Kafka Topic: ${topic}`)

    const _writeObj = (obj: StreamObj, enc: string|null, cb: StreamCb): void => {
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

      producer.send(topic, message, key, partition)
        .then(() => setImmediate(cb))
        .catch((err: Error|undefined) => {
          // stream.destroy()
          setImmediate(() => cb(err))
        })
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
      final: (cb): void => {
        producer.flush().then((): void => {
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
