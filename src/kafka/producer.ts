/***
 * Return the singleton kafka producer instance
 */
import { Producer, CODES, Client } from 'node-rdkafka'
const ErrorCode = CODES.ERRORS

type Stats = { [key: string]: number }
// let producer: Producer
// let producerReady: false|Promise<Client> = false
let isConnected = false
let producerReady: Promise<Producer> = Promise.reject(Error('Producer not connected'))
let _metadata: {} = {}
const stats: Stats = {}
let _deferredMsgs = 0

/**
 *
 */
async function _connect ({
  brokers = process.env.KPIPE_BROKERS || 'localhost:9092',
  debug = false,
  ...options
} = {}): Promise<Client> {
  if (isConnected) {
    return producerReady
  }

  // brokers = brokers || process.env.KPIPE_BROKERS || 'localhost:9092'

  const opts = {
    'client.id': 'kpipe',
    'metadata.broker.list': brokers,
    'debug': '',
    ...options
  }

  if (debug) {
    opts.debug = 'broker,topic'
  }

  _deferredMsgs = 0

  // producer = new Producer(opts)
  // producer.on('disconnected', (arg) => {
  //   console.info('Producer disconnected ' + JSON.stringify(arg))
  // })

  producerReady = new Promise((resolve) => {
    const producer = new Producer(opts)
    producer.on('disconnected', (arg) => {
      console.info('Producer disconnected ' + JSON.stringify(arg))
    })

    producer.once('ready', (arg) => {
      console.info('Producer ready ' + JSON.stringify(arg))
      resolve(producer)
    })

    console.info('Producer connecting...')
    producer.connect({}, (err, metadata) => {
      if (err) {
        return console.error(err)
      }
      _metadata = Object.assign({}, metadata)
      console.info('Producer connected')
    })
  })

  isConnected = true

  return producerReady
}

/**
 *
 */
function _counter (topic: string): void {
  if (!stats[topic]) {
    stats[topic] = 0
  }
  stats[topic]++
}

/**
 *
 */
async function _send (
  topic: string,
  message: Buffer|string,
  key?: Buffer|string|null,
  partition?: number
): Promise<void> {
  // if (typeof message !== 'string' && !Buffer.isBuffer(message)) {
  //   throw Error('message must be a buffer or a string')
  // }

  if (!isConnected) {
    throw Error('produce() called before connect()')
  }

  // if (key && typeof key !== 'string' && !Buffer.isBuffer(key)) {
  //   throw Error('key must be a buffer or a string')
  // }

  if (key) {
    key = Buffer.isBuffer(key) ? key : Buffer.from(key)
  }
  message = Buffer.isBuffer(message) ? message : Buffer.from(message)

  _deferredMsgs++
  return _produce(topic, message, key, partition)
}

/**
 *
 */
async function _produce (
  topic: string,
  message: Buffer|string,
  key?: Buffer|string|null,
  partition?: number
): Promise<any> {
  // if (!producer) {
  //   throw Error('producer connection has gone away')
  // }

  return producerReady.then((p) => {
    try {
      p.produce(topic, partition, message, key, null)
      _counter(topic)
      _deferredMsgs--
      // return p
    } catch (err) {
      if (ErrorCode.ERR__QUEUE_FULL === err.code) {
        // Poll for good measure
        p.poll()

        // Just delay this thing a bit and pass the params again
        setTimeout(() => _produce(topic, message, key), 500)
      } else {
        _deferredMsgs--
        return Promise.reject(err)
      }
    }
  })
    .catch((err: Error) => {
      console.error(err)
    })
}

/**
 *
 */
async function _flush (): Promise<Producer> {
  return producerReady
    .then((p) => new Promise<Producer>((resolve) => {
      const checkDeferred = (): void => {
        if (_deferredMsgs > 0) {
          setTimeout(() => checkDeferred(), 1000)
        } else {
          resolve(p)
        }
      }
      checkDeferred()
    }))
    .then((p) => new Promise<Producer>((resolve, reject) => {
      p.flush(20000, (err?: Error) => {
        if (err) {
          return reject(err)
        }
        resolve(p)
      })
    }))
}

/**
 *
 */
async function _disconnect (): Promise<void> {
  // if (producer) {
  return producerReady
    .then(() => _flush())
    .then((p) => new Promise((resolve, reject) => {
      p.disconnect(10000, (err) => {
        if (err) {
          return reject(err)
        }
        // producer = undefined
        producerReady = Promise.reject(Error('Producer not connected'))
        isConnected = false
        resolve()
      })
    }))
  // }
}

/**
 * Compare current stats to ones previously captured
 */
function _deltaStats (prev: Stats): Stats {
  const delta: Stats = {}
  Object.entries(stats).map((e) => {
    delta[e[0]] = e[1] - (prev[e[0]] || 0)
  })
  return delta
}

process.on('exit', () => {
  producerReady.then(() => _disconnect()).catch((err) => console.error(err))
})

module.exports = {
  connect: _connect,
  send: _send,
  flush: _flush,
  disconnect: _disconnect,
  stats: (): Stats => Object.assign({}, stats),
  deltaStats: _deltaStats,
  metadata: (): {} => Object.assign({}, _metadata)
}
