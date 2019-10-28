/***
 * Return the singleton kafka producer instance
 */
const { Producer, CODES } = require('node-rdkafka')
const ErrorCode = CODES.ERRORS

let producer = null
let producerReady = false
let _metadata = null
const stats = {}

/**
 * 
 */
async function _connect ({ brokers, debug, ...options }) {
  if (producer) {
    return producerReady
  }

  brokers = brokers || process.env.DPIPE_BROKERS || 'localhost:9092'

  const opts = {
    'client.id': 'dpipe',
    'metadata.broker.list': brokers,
    ...options
  }

  if (debug) {
    opts.debug = 'broker,topic'
  }

  producer = new Producer(opts)
  producer.on('disconnected', (arg) => {
    console.info('Producer disconnected ' + JSON.stringify(arg))
  })
  // producer.on('SIGTERM', () => producer.disconnect())
  // producer.setPollInterval(1000)

  producerReady = new Promise((resolve, reject) => {
    producer.on('ready', (arg) => {
      console.info('Producer ready ' + JSON.stringify(arg))
      resolve(producer)
    })
  })

  console.info('Producer connecting...')
  producer.connect({}, (err, metadata) => {
    if (err) {
      return console.error(err)
    }
    _metadata = Object.assign({}, metadata)
    console.info('Producer connected')
  })

  return producerReady
}

/**
 * 
 */
function _counter (topic) {
  if (!stats[topic]) {
    stats[topic] = 0
  }
  stats[topic]++
}

/**
 * 
 */
async function _produce (topic, message, key) {
  if (typeof message !== 'string' && !Buffer.isBuffer(message)) {
    throw Error('message must be a buffer or a string')
  }

  if (!producer) {
    throw Error('produce() called before connect()')
  }

  if (key && typeof key !== 'string' && !Buffer.isBuffer(key)) {
    throw Error('key must be a buffer or a string')
  }

  if (key) {
    key = Buffer.isBuffer(key) ? key : Buffer.from(key)
  }
  message = Buffer.isBuffer(message) ? message : Buffer.from(message)

  return producerReady.then((p) => {
    try {
      p.produce(topic, null, message, key, null)
      _counter(topic)
      return p
    } catch (err) {
      if (ErrorCode.ERR__QUEUE_FULL === err.code) {
        // Poll for good measure
        p.poll()

        // Just delay this thing a bit and pass the params again
        setTimeout(() => _produce(topic, message, key), 500)
      } else {
        return Promise.reject(err)
      }
    }
  })
}

/**
 * 
 */
async function _flush () {
  if (producer) {
    return producerReady.then((p) =>
      new Promise((resolve, reject) => {
        p.flush(10000, (err) => {
          if (err) {
            return reject(err)
          }
          resolve(p)
        })
      }))
  }
}

/**
 * 
 */
async function _disconnect () {
  if (producer) {
    return producerReady
      .then(() => _flush())
      .then((p) => new Promise((resolve, reject) => {
        p.disconnect(10000, (err) => {
          if (err) {
            return reject(err)
          }
          producer = null
          producerReady = false
          resolve()
        })
      }))
  }
}

/**
 * Compare current stats to ones previously captured
 */
function _deltaStats (prev) {
  const delta = {}
  Object.entries(stats).map((e) => {
    delta[e[0]] = e[1] - (prev[e[0]] || 0)
  })
  return delta
}

process.on('exit', () => {
  if (producer) {
    producerReady.then(() => _disconnect())
  }
})

module.exports = {
  connect: _connect,
  send: _produce,
  flush: _flush,
  disconnect: _disconnect,
  stats: () => Object.assign({}, stats),
  deltaStats: _deltaStats,
  metadata: () => Object.assign({}, _metadata)
}
