"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/***
 * Return the singleton kafka producer instance
 */
const node_rdkafka_1 = require("node-rdkafka");
const ErrorCode = node_rdkafka_1.CODES.ERRORS;
class ProducerImpl {
    constructor() {
        this.isConnected = false;
        this._metadata = {};
        this._stats = {};
        this._deferredMsgs = 0;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ProducerImpl();
        }
        return this.instance;
    }
    /**
     *
     */
    async connect({ brokers = process.env.KPIPE_BROKERS || 'localhost:9092', debug = false, ...rest } = {}) {
        if (this.isConnected) {
            if (!this.producerReady) {
                throw Error('Producer is connected without client promise');
            }
            return this.producerReady;
        }
        const opts = {
            'client.id': 'kpipe',
            'metadata.broker.list': brokers,
            ...rest
        };
        if (debug) {
            opts.debug = 'broker,topic';
        }
        this._deferredMsgs = 0;
        this.producerReady = new Promise((resolve) => {
            const producer = new node_rdkafka_1.Producer(opts);
            producer.on('disconnected', (arg) => {
                console.info('Producer disconnected ' + JSON.stringify(arg));
            });
            producer.once('ready', (arg) => {
                console.info('Producer ready ' + JSON.stringify(arg));
                resolve(producer);
            });
            console.info('Producer connecting...');
            producer.connect({}, (err, metadata) => {
                if (err) {
                    return console.error(err);
                }
                this._metadata = Object.assign({}, metadata);
                console.info('Producer connected');
            });
        });
        this.isConnected = true;
        return this.producerReady;
    }
    metadata() {
        return Object.assign({}, this._metadata);
    }
    /**
     *
     */
    _counter(topic) {
        if (!this._stats[topic]) {
            this._stats[topic] = 0;
        }
        this._stats[topic]++;
    }
    stats() {
        return Object.assign({}, this._stats);
    }
    /**
     *
     */
    async send(topic, message, key, partition) {
        if (!this.isConnected) {
            throw Error('produce() called before connect()');
        }
        if (key) {
            key = Buffer.isBuffer(key) ? key : Buffer.from(key);
        }
        message = Buffer.isBuffer(message) ? message : Buffer.from(message);
        this._deferredMsgs++;
        return this._produce(topic, message, key, partition);
    }
    doproduce(p, topic, message, key, partition, cb, stalls = 0) {
        try {
            p.produce(topic, partition, message, key, null);
            this._counter(topic);
            this._deferredMsgs--;
            return cb();
        }
        catch (err) {
            if (ErrorCode.ERR__QUEUE_FULL === err.code) {
                stalls++;
                // console.error('Producer queue full ' + stalls)
                // Poll for good measure
                p.poll();
                // Just delay this thing a bit and pass the params again
                setTimeout(() => this.doproduce(p, topic, message, key, partition, cb, stalls), 500);
            }
            else {
                this._deferredMsgs--;
                return cb(err);
            }
        }
    }
    /**
     *
     */
    async _produce(topic, message, key, partition) {
        if (!this.producerReady) {
            return Promise.reject(Error('producer is not connected'));
        }
        return this.producerReady.then((p) => {
            return new Promise((resolve, reject) => {
                this._deferredMsgs++;
                this.doproduce(p, topic, message, key, partition, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(p);
                });
            });
        });
    }
    /**
     *
     */
    async flush() {
        if (!this.producerReady) {
            return Promise.reject(Error('producer is not connected'));
        }
        return this.producerReady
            .then((p) => new Promise((resolve) => {
            const checkDeferred = () => {
                if (this._deferredMsgs > 0) {
                    setTimeout(() => checkDeferred(), 1000);
                }
                else {
                    resolve(p);
                }
            };
            checkDeferred();
        }))
            .then((p) => new Promise((resolve, reject) => {
            p.flush(20000, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(p);
            });
        }));
    }
    /**
     *
     */
    async disconnect() {
        if (!this.isConnected) {
            return Promise.resolve();
        }
        if (!this.producerReady) {
            return Promise.reject(Error('producer is not connected'));
        }
        return this.producerReady
            .then(() => this.flush())
            .then((p) => new Promise((resolve, reject) => {
            p.disconnect(10000, (err) => {
                if (err) {
                    return reject(err);
                }
                // producer = undefined
                this.producerReady = undefined; // Promise.reject(Error('Producer not connected'))
                this.isConnected = false;
                resolve();
            });
        }));
    }
    /**
     * Compare current stats to ones previously captured
     */
    deltaStats(prev) {
        const delta = {};
        Object.entries(this._stats).map((e) => {
            delta[e[0]] = e[1] - (prev[e[0]] || 0);
        });
        return delta;
    }
}
exports.KafkaProducer = ProducerImpl.getInstance();
//# sourceMappingURL=producer.js.map