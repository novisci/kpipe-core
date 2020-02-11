"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Temper {
    constructor({ prefix, flush } = {}) {
        this._flush = flush || (async (fn) => { console.info(fn); });
        this._prefix = prefix || 'temp-';
        this._temps = [];
    }
    get() {
        const t = this._prefix + require('uid-safe').sync(6);
        this._temps.push(t);
        return t;
    }
    async flush() {
        await Promise.all(this._temps.map(async (t) => {
            console.info('flushing: ' + t);
            await this._flush(t);
        }));
        this._temps = [];
    }
}
/***
 * Generate temporary filenames, delete them on flush
 */
function FileTemper() {
    const unlink = require('util').promisify(require('fs').unlink);
    return new Temper({
        prefix: 'tempfile-',
        flush: async (fn) => { unlink(fn); }
    });
}
exports.FileTemper = FileTemper;
/***
 * Generate temporary topic names, delete the topics on flush
 */
function TopicTemper() {
    const kafkaAdmin = require('..').KafkaAdmin({
        brokers: process.env.KPIPE_BROKERS
    });
    return new (require('./temper'))({
        prefix: 'temptopic-',
        flush: async (topic) => {
            await kafkaAdmin.deleteTopic(topic)
                .then(() => console.info(`Deleted topic ${topic}`))
                .catch(console.error)
                .then(() => kafkaAdmin.disconnect());
        }
    });
}
exports.TopicTemper = TopicTemper;
//# sourceMappingURL=temper.js.map