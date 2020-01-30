import { AdminClient, InternalAdminClient } from 'node-rdkafka'

const TIMEOUT = 1000

type KafkaAdminOpts = {
  brokers?: string
}

class KafkaAdmin {
  _client: InternalAdminClient

  constructor ({ brokers = 'localhost:9092' }: KafkaAdminOpts) {
    this._client = AdminClient.create({
      'metadata.broker.list': brokers,
      'socket.keepalive.enable': true
      // 'debug': 'consumer'
    })
    return this
  }

  createTopic (topic: string, nParts: number, nReplicas: number, options: {}): Promise<void> {
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

  deleteTopic (topic: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client.deleteTopic(topic, TIMEOUT, (err: Error|null) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  createPartitions (topic: string, nParts: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client.createPartitions(topic, nParts, TIMEOUT, (err: Error|null) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  disconnect (): void {
    this._client.disconnect()
  }
}

export default function (options: KafkaAdminOpts = {}): KafkaAdmin {
  return new KafkaAdmin(options)
}
