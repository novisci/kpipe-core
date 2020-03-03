import { TopicTemper } from './temper'
import { Reader } from '../src/reader'
import { KafkaAdmin } from '..'
const ppipe = require('util').promisify(require('stream').pipeline)
const topicTemper = TopicTemper()

const kafkaReader = Reader({
  type: 'kafka',
  brokers: process.env.KPIPE_BROKERS,
  objectMode: true
})

const kafkaAdmin = KafkaAdmin({
  brokers: process.env.KPIPE_BROKERS
})

// beforeEach()
afterEach(async () => topicTemper.flush())

test.skip('test kafka consumer', async () => {

})