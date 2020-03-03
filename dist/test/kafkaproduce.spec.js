"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const temper_1 = require("./temper");
const __1 = require("..");
const ppipe = require('util').promisify(require('stream').pipeline);
const kafkaWriter = __1.Writer({
    type: 'kafka',
    brokers: process.env.KPIPE_BROKERS,
    objectMode: true
});
const kafkaAdmin = __1.KafkaAdmin({
    brokers: process.env.KPIPE_BROKERS
});
const topicTemper = temper_1.TopicTemper();
beforeAll(async () => __1.KafkaProducer().connect());
afterEach(async () => topicTemper.flush());
afterAll(async () => __1.KafkaProducer().disconnect());
test('write json stream to topic', async () => {
    const filename = './test/data/stream.json';
    const topic = topicTemper.get();
    await kafkaAdmin.createTopic(topic, 1, 0, {});
    console.info(`Created topic ${topic}`);
    await kafkaAdmin.disconnect();
    const xform = require('stream').Transform({
        writableObjectMode: false,
        readableObjectMode: true,
        transform: (chunk, enc, cb) => {
            chunk.toString().split('\n').forEach((l) => {
                xform.push(l + '\n');
            });
            cb();
        }
    });
    await ppipe(require('..').Reader({ type: 'fs' })(filename), xform, kafkaWriter(topic));
});
//# sourceMappingURL=kafkaproduce.spec.js.map