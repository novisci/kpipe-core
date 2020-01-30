"use strict";
function Temper(options) {
    if (!(this instanceof Temper)) {
        return new Temper(options);
    }
    this._flush = console.info;
    this._prefix = 'temp-';
    options = options || {};
    if (options.prefix) {
        this._prefix = options.prefix;
    }
    if (options.flush) {
        this._flush = options.flush;
    }
    this._temps = [];
    return this;
}
Temper.prototype.get = function () {
    const t = this._prefix + require('uid-safe').sync(6);
    this._temps.push(t);
    return t;
};
Temper.prototype.flush = async function () {
    await Promise.all(this._temps.map(async (t) => {
        console.info('flushing: ' + t);
        await this._flush(t);
    }));
    this._temps = [];
};
/***
 * Generate temporary filenames, delete them on flush
 */
Temper.FileTemper = function () {
    const unlink = require('util').promisify(require('fs').unlink);
    return new Temper({
        prefix: 'tempfile-',
        flush: async (fn) => unlink(fn)
    });
};
/***
 * Generate temporary topic names, delete the topics on flush
 */
Temper.TopicTemper = function (options) {
    options = options || {};
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
};
module.exports = Temper;
//# sourceMappingURL=temper.js.map