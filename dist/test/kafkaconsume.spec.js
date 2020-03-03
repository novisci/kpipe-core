"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const temper_1 = require("./temper");
const reader_1 = require("../src/reader");
const __1 = require("..");
const ppipe = require('util').promisify(require('stream').pipeline);
const topicTemper = temper_1.TopicTemper();
const kafkaReader = reader_1.Reader({
    type: 'kafka',
    brokers: process.env.KPIPE_BROKERS,
    objectMode: true
});
const kafkaAdmin = __1.KafkaAdmin({
    brokers: process.env.KPIPE_BROKERS
});
// beforeEach()
afterEach(async () => topicTemper.flush());
test.skip('test kafka consumer', async () => {
});
//# sourceMappingURL=kafkaconsume.spec.js.map