const { TopicTemper } = require('./temper')
const ppipe = require('util').promisify(require('stream').pipeline)

const kafkaReader = require('..').Reader({
  type: 'kafka',
  brokers: process.env.DPIPE_BROKERS,
  objectMode: true
})

const kafkaAdmin = require('..').KafkaAdmin({
  brokers: process.env.DPIPE_BROKERS
})

// beforeEach()
afterEach(async () => topicTemper.flush())

test.skip('test kafka consumer', async () => {

})