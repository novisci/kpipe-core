"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_rdkafka_1 = require("node-rdkafka");
const TIMEOUT = 1000;
class KafkaAdmin {
    constructor({ brokers = 'localhost:9092' }) {
        this._client = node_rdkafka_1.AdminClient.create({
            'metadata.broker.list': brokers,
            'socket.keepalive.enable': true
            // 'debug': 'consumer'
        });
        return this;
    }
    createTopic(topic, nParts, nReplicas, options) {
        return new Promise((resolve, reject) => {
            this._client.createTopic({
                topic,
                num_partitions: nParts || 1,
                replication_factor: nReplicas || 1,
                config: options || {}
            }, TIMEOUT, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    deleteTopic(topic) {
        return new Promise((resolve, reject) => {
            this._client.deleteTopic(topic, TIMEOUT, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    createPartitions(topic, nParts) {
        return new Promise((resolve, reject) => {
            this._client.createPartitions(topic, nParts, TIMEOUT, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    disconnect() {
        this._client.disconnect();
    }
}
function default_1(options = {}) {
    return new KafkaAdmin(options);
}
exports.default = default_1;
//# sourceMappingURL=admin.js.map