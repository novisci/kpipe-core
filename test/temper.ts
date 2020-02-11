type TemperOpts = {
  prefix?: string
  flush?: (fn: string) => Promise<void>
}
class Temper {
  readonly _flush: (temp: string) => Promise<void>
  readonly _prefix: string
  _temps: string[]

  constructor ({ prefix, flush }: TemperOpts = {}) {
    this._flush = flush || (async (fn: string): Promise<void> => { console.info(fn) })
    this._prefix = prefix || 'temp-'
    this._temps = []
  }

  get (): string {
    const t = this._prefix + require('uid-safe').sync(6)
    this._temps.push(t)
    return t
  }

  async flush (): Promise<void> {
    await Promise.all(this._temps.map(async (t) => {
      console.info('flushing: ' + t)
      await this._flush(t)
    }))

    this._temps = []
  }
}

/***
 * Generate temporary filenames, delete them on flush
 */
export function FileTemper (): Temper {
  const unlink = require('util').promisify(require('fs').unlink)
  return new Temper({
    prefix: 'tempfile-',
    flush: async (fn: string): Promise<void> => { unlink(fn) }
  })
}

/***
 * Generate temporary topic names, delete the topics on flush
 */
export function TopicTemper (): Temper {
  const kafkaAdmin = require('..').KafkaAdmin({
    brokers: process.env.KPIPE_BROKERS
  })

  return new (require('./temper'))({
    prefix: 'temptopic-',
    flush: async (topic: string): Promise<void> => {
      await kafkaAdmin.deleteTopic(topic)
        .then(() => console.info(`Deleted topic ${topic}`))
        .catch(console.error)
        .then(() => kafkaAdmin.disconnect())
    }
  })
}
