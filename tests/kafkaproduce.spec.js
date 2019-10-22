const { TopicTemper } = require('./temper')
const { Writer, KafkaAdmin, KafkaProducer } = require('..')
const ppipe = require('util').promisify(require('stream').pipeline)

const kafkaWriter = Writer({
  type: 'kafka',
  brokers: process.env.DPIPE_BROKERS,
  objectMode: true
})

const kafkaAdmin = KafkaAdmin({
  brokers: process.env.DPIPE_BROKERS
})

const topicTemper = TopicTemper()

afterEach(async () => topicTemper.flush())
afterAll(async () => KafkaProducer.disconnect())

test('write json stream to topic', async () => {
  const filename = './tests/data/stream.json'
  const topic = topicTemper.get()

  await kafkaAdmin.createTopic(topic, 1, 0, {})
  console.info(`Created topic ${topic}`)

  await kafkaAdmin.disconnect()

  await ppipe(
    require('..').Reader({ type: 'fs' })(filename),
    require('../../streams').Transform.Delineate(), // Remove this dependency
    require('../../streams').Transform.JSONParse(), // Remove this dependency
    kafkaWriter(topic)
  )
})
