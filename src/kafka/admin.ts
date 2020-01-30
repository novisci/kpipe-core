import { AdminClient } from 'node-rdkafka'

const TIMEOUT = 1000

type KafkaAdminOpts = {
  brokers?: string
}

interface KafkaAdmin {
  constructor (options: KafkaAdminOpts): KafkaAdmin
  createTopic (topic: string, nParts: number, nReplicas: number, options: {}): Promise<void>
  deleteTopic (topic: string): Promise<void>
  createPartitions (topic: string, nParts: number): Promise<void>
  disconnect (): Promise<void>
}

function KafkaAdmin (this: unknown, options: KafkaAdminOpts = {}): KafkaAdmin {
  if (!(this instanceof KafkaAdmin)) {
    return new KafkaAdmin(options)
  }

  options = options || {}
  options = Object.assign({}, options)
  options.brokers = options.brokers || 'localhost:9092'

  this._client = AdminClient.create({
    'metadata.broker.list': options.brokers,
    'socket.keepalive.enable': true
    // 'debug': 'consumer'
  })
  return this
}

KafkaAdmin.prototype.createTopic = function (topic: string, nParts: number, nReplicas: number, options: {}): Promise<void> {
  return new Promise((resolve, reject) => {
    this._client.createTopic({
      topic,
      num_partitions: nParts || 1,
      replication_factor: nReplicas || 1,
      config: options || {}
    }, TIMEOUT, (err: Error|null) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

KafkaAdmin.prototype.deleteTopic = function (topic) {
  return new Promise((resolve, reject) => {
    this._client.deleteTopic(topic, TIMEOUT, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

KafkaAdmin.prototype.createPartitions = function (topic, nParts) {
  return new Promise((resolve, reject) => {
    this._client.createPartitions(topic, nParts, TIMEOUT, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

KafkaAdmin.prototype.disconnect = function () {
  this._client.disconnect()
}

module.exports = KafkaAdmin
