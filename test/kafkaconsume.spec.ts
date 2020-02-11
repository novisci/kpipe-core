import { TopicTemper } from './temper'
const ppipe = require('util').promisify(require('stream').pipeline)
const topicTemper = TopicTemper()

const kafkaReader = require('..').Reader({
  type: 'kafka',
  brokers: process.env.KPIPE_BROKERS,
  objectMode: true
})

const kafkaAdmin = require('..').KafkaAdmin({
  brokers: process.env.KPIPE_BROKERS
})

// beforeEach()
afterEach(async () => topicTemper.flush())

test.skip('test kafka consumer', async () => {

})