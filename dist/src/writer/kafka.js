"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstream_1 = require("../tstream");
const producer_1 = require("../kafka/producer");
function bkKafka({ brokers = 'localhost:9092', debug = false, 
// objectMode = false,
producerOpts = {}, fnKey } = {}) {
    const producer = producer_1.KafkaProducer();
    producer.connect({ brokers, debug, ...producerOpts })
        .catch((e) => console.error(e));
    return (topic, partition) => {
        if (!topic) {
            throw Error('topic is required in KafkaProducer.send()');
        }
        console.info(`WRITE Kafka Topic: ${topic}`);
        const _writeObj = (obj, enc, cb) => {
            if (Buffer.isBuffer(obj)) {
                return cb(Error('Kafka writable stream in object mode does not handle buffers'));
            }
            let key = null;
            if (fnKey) {
                // Explicit key extract function supplied
                key = fnKey(obj);
            }
            else {
                // Key is inferred. Either the first element of an array
                //  or a property of an object named "key"
                if (Array.isArray(obj)) {
                    key = obj[0];
                }
                else if (typeof obj === 'object' &&
                    obj !== null &&
                    typeof obj.key !== 'undefined') {
                    key = obj.key;
                }
            }
            let message;
            if (typeof obj === 'string') {
                message = Buffer.from(obj);
            }
            else {
                message = Buffer.from(JSON.stringify(obj));
            }
            producer.send(topic, message, key, partition)
                .then(() => setImmediate(cb))
                .catch((err) => {
                // stream.destroy()
                setImmediate(() => cb(err));
            });
        };
        // const _writeBuf = (message, enc, cb) => {
        //   producer.send(topic, message, null, partition)
        //     .then(() => setImmediate(cb))
        //     .catch((err) => {
        //       // stream.close()
        //       setImmediate(() => cb(err))
        //     })
        // }
        const stream = new tstream_1.Writable({
            objectMode: true,
            write: /* objectMode !== true ? _writeBuf : */ _writeObj,
            final: (cb) => {
                producer.flush().then(() => {
                    // Object.entries(stats).map((e) => {
                    //   console.debug(`${e[0]}: ${e[1].toLocaleString()}`)
                    // })
                    cb();
                }).catch((err) => cb(err));
            }
        });
        stream.on('error', (err) => {
            console.error('Producer stream error');
            console.error(err);
        });
        return stream;
    };
}
exports.bkKafka = bkKafka;
//# sourceMappingURL=kafka.js.map