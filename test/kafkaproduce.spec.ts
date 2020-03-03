import { TopicTemper } from './temper'
import { Writer, KafkaAdmin, KafkaProducer } from '..'
const ppipe = require('util').promisify(require('stream').pipeline)

const kafkaWriter = Writer({
  type: 'kafka',
  brokers: process.env.KPIPE_BROKERS,
  objectMode: true
})

const kafkaAdmin = KafkaAdmin({
  brokers: process.env.KPIPE_BROKERS
})

const topicTemper = TopicTemper()

// beforeAll(async () => KafkaProducer().connect())

afterEach(async () => topicTemper.flush())
afterAll(async () => KafkaProducer.disconnect())

test('write json stream to topic', async () => {
  const filename = './test/data/stream.json'
  const topic = topicTemper.get()

  await kafkaAdmin.createTopic(topic, 1, 0, {})
  console.info(`Created topic ${topic}`)

  await kafkaAdmin.disconnect()

  const xform = require('stream').Transform({
    writableObjectMode: false,
    readableObjectMode: true,

    transform: (chunk: Buffer, enc: any, cb: (err?: Error) => void) => {
      chunk.toString().split('\n').forEach((l) => {
        xform.push(l + '\n')
      })
      cb()
    }
  })

  await ppipe(
    require('..').Reader({ type: 'fs' })(filename),
    xform,
    kafkaWriter(topic)
  )
})
