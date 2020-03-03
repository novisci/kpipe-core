/***
 * Return the singleton kafka producer instance
 */
import { Producer, CODES, Client } from 'node-rdkafka'
const ErrorCode = CODES.ERRORS

type Stats = { [key: string]: number }
type ConnectOpts = {
  brokers?: string
  debug?: boolean
  [key: string]: any
}

interface KafkaProducer {
  connect (options?: ConnectOpts): Promise<Producer>
  send (topic: string, message: Buffer|string, key?: Buffer|string|null, partition?: number): Promise<void>
  flush (): Promise<Producer>
  disconnect (): Promise<void>
  stats (): Stats
  deltaStats (prev: Stats): Stats
  metadata (): {}
  producerReady: Promise<Producer>
}

// let producer: KafkaProducer
export function KafkaProducer (): KafkaProducer {
  // if (!producer) {
  //   producer = new ProducerImpl()
  //   process.on('exit', () => {
  //     producer.producerReady.then((p) => p.disconnect()).catch((err) => console.error(err))
  //   })
  // }
  return ProducerImpl.getInstance()
}

class ProducerImpl implements KafkaProducer {
  isConnected = false
  producerReady: Promise<Producer> = Promise.reject(Error('Producer not connected'))
  _metadata: {} = {}
  _stats: Stats = {}
  _deferredMsgs = 0

  private static instance: ProducerImpl

  static getInstance (): ProducerImpl {
    if (!this.instance) {
      this.instance = new ProducerImpl()
    }
    return this.instance
  }

  /**
   *
   */
  async connect (options: ConnectOpts = {}): Promise<Producer> {
    if (this.isConnected) {
      return this.producerReady
    }

    // brokers = brokers || process.env.KPIPE_BROKERS || 'localhost:9092'
    const {
      brokers = process.env.KPIPE_BROKERS || 'localhost:9092',
      debug = false,
      ...rest
    } = options

    const opts = {
      'client.id': 'kpipe',
      'metadata.broker.list': brokers,
      'debug': '',
      ...rest
    }

    if (debug) {
      opts.debug = 'broker,topic'
    }

    this._deferredMsgs = 0

    // producer = new Producer(opts)
    // producer.on('disconnected', (arg) => {
    //   console.info('Producer disconnected ' + JSON.stringify(arg))
    // })

    this.producerReady = new Promise((resolve) => {
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
        this._metadata = Object.assign({}, metadata)
        console.info('Producer connected')
      })
    })

    this.isConnected = true

    return this.producerReady
  }

  metadata (): {} {
    return Object.assign({}, this._metadata)
  }

  /**
   *
   */
  _counter (topic: string): void {
    if (!this._stats[topic]) {
      this._stats[topic] = 0
    }
    this._stats[topic]++
  }

  stats (): {} {
    return Object.assign({}, this._stats)
  }

  /**
   *
   */
  async send (
    topic: string,
    message: Buffer|string,
    key?: Buffer|string|null,
    partition?: number
  ): Promise<void> {
    // if (typeof message !== 'string' && !Buffer.isBuffer(message)) {
    //   throw Error('message must be a buffer or a string')
    // }

    if (!this.isConnected) {
      throw Error('produce() called before connect()')
    }

    // if (key && typeof key !== 'string' && !Buffer.isBuffer(key)) {
    //   throw Error('key must be a buffer or a string')
    // }

    if (key) {
      key = Buffer.isBuffer(key) ? key : Buffer.from(key)
    }
    message = Buffer.isBuffer(message) ? message : Buffer.from(message)

    this._deferredMsgs++
    return this._produce(topic, message, key, partition)
  }

  /**
   *
   */
  async _produce (
    topic: string,
    message: Buffer|string,
    key?: Buffer|string|null,
    partition?: number
  ): Promise<any> {
    // if (!producer) {
    //   throw Error('producer connection has gone away')
    // }

    return this.producerReady.then((p) => {
      try {
        p.produce(topic, partition, message, key, null)
        this._counter(topic)
        this._deferredMsgs--
        // return p
      } catch (err) {
        if (ErrorCode.ERR__QUEUE_FULL === err.code) {
          // Poll for good measure
          p.poll()

          // Just delay this thing a bit and pass the params again
          setTimeout(() => this._produce(topic, message, key), 500)
        } else {
          this._deferredMsgs--
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
  async flush (): Promise<Producer> {
    return this.producerReady
      .then((p) => new Promise<Producer>((resolve) => {
        const checkDeferred = (): void => {
          if (this._deferredMsgs > 0) {
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
  async disconnect (): Promise<void> {
    // if (producer) {
    return this.producerReady
      .then(() => this.flush())
      .then((p) => new Promise((resolve, reject) => {
        p.disconnect(10000, (err) => {
          if (err) {
            return reject(err)
          }
          // producer = undefined
          this.producerReady = Promise.reject(Error('Producer not connected'))
          this.isConnected = false
          resolve()
        })
      }))
    // }
  }

  /**
   * Compare current stats to ones previously captured
   */
  deltaStats (prev: Stats): Stats {
    const delta: Stats = {}
    Object.entries(this._stats).map((e) => {
      delta[e[0]] = e[1] - (prev[e[0]] || 0)
    })
    return delta
  }
}
