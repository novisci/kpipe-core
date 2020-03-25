import { Writable } from 'node-typestream'
import { WritableStreamGenerator, StreamCb } from '../backend'
import { KafkaProducer } from '../kafka/producer'

type StreamObj = Buffer|string|{ key?: string, [key: string]: any }

const MAX_RETRIES = 5
const MAX_WAITMS = 10000

function backoffTime (retries: number): number {
  return Math.min(Math.pow(2, retries) * 100, MAX_WAITMS)
}

type KafkaWriterOpts = {
  brokers?: string
  debug?: boolean
  // objectMode?: boolean
  producerOpts?: { [key: string]: any }
  fnKey?: (msg: StreamObj) => string
}

export function bkKafka ({
  brokers = 'localhost:9092',
  debug = false,
  // objectMode = false,
  producerOpts = {},
  fnKey
}: KafkaWriterOpts = {}): WritableStreamGenerator<{} | string> {
  KafkaProducer.connect({ brokers, debug, ...producerOpts })

  return (topic, partition): Writable<{} | string> => {
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
        } else if (
          typeof obj === 'object' &&
          obj !== null &&
          typeof obj.key !== 'undefined'
        ) {
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
      function send (topic: string, message: Buffer, key: string|null, partition?: number): void {
        KafkaProducer.connect({ brokers, debug, ...producerOpts }) // Pass through when already connected
          .then(() => KafkaProducer.send(topic, message, key, partition))
          .then(() => setImmediate(cb))
          .catch((err) => {
            if (err.message === 'timed out') {
              if (retries < MAX_RETRIES) {
                KafkaProducer.disconnect()
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
    }

    // const _writeBuf = (message, enc, cb) => {
    //   producer.send(topic, message, null, partition)
    //     .then(() => setImmediate(cb))
    //     .catch((err) => {
    //       // stream.close()
    //       setImmediate(() => cb(err))
    //     })
    // }

    const stream = new Writable<{} | string>({
      objectMode: true,
      write: /* objectMode !== true ? _writeBuf : */ _writeObj,
      final: (cb: (error?: Error | null) => void): void => {
        KafkaProducer.flush().then((): void => {
          // Object.entries(stats).map((e) => {
          //   console.debug(`${e[0]}: ${e[1].toLocaleString()}`)
          // })
          cb()
        }).catch((err: Error) => cb(err))
      }
    })

    stream.on('error', (err) => {
      console.error('Producer stream error')
      console.error(err)
    })

    return stream
  }
}
