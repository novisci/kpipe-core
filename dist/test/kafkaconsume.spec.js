"use strict";
const { TopicTemper } = require('./temper');
const ppipe = require('util').promisify(require('stream').pipeline);
const kafkaReader = require('..').Reader({
    type: 'kafka',
    brokers: process.env.KPIPE_BROKERS,
    objectMode: true
});
const kafkaAdmin = require('..').KafkaAdmin({
    brokers: process.env.KPIPE_BROKERS
});
// beforeEach()
afterEach(async () => topicTemper.flush());
test.skip('test kafka consumer', async () => {
});
//# sourceMappingURL=kafkaconsume.spec.js.map