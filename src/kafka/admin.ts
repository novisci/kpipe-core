import { AdminClient } from 'node-rdkafka'

const TIMEOUT = 1000

function KafkaAdmin (options) {
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
}

KafkaAdmin.prototype.createTopic = function (topic, nParts, nReplicas, options) {
  return new Promise((resolve, reject) => {
    this._client.createTopic({
      topic,
      num_partitions: nParts || 1,
      replication_factor: nReplicas || 1,
      config: options || {}
    }, TIMEOUT, (err) => {
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
