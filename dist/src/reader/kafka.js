"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_rdkafka_1 = require("node-rdkafka");
const tstream_1 = require("../tstream");
function topicConf(topic, seek) {
    if (!seek || typeof seek.partition === 'undefined') {
        return false;
    }
    return {
        topic,
        partition: seek.partition,
        offset: seek.offset
    };
}
function bkKafka({ brokers = 'localhost:9092', groupid = 'cgroup-' + require('uid-safe').sync(6), commit = false, closeAtEnd = true, chunkSize = 16, timeout, fullMessage = false, debug = false }) {
    let endOfPartition = null;
    return (topic, position = {}) => {
        console.info(`READ Kafka Topic (chunked): ${topic}/${groupid} ${JSON.stringify(position)}`);
        let nPushed = 0;
        let isEnded = false;
        let lastMsgTime = Date.now();
        function endStream() {
            if (!isEnded) {
                isEnded = true;
                stream.push(null);
            }
        }
        function consume() {
            if (isEnded) {
                return;
            }
            let count = chunkSize;
            if (position.count) {
                count = Math.min(count, position.count - nPushed);
            }
            if (count === 0) {
                return;
            }
            consumer.consume(count, (err, messages) => {
                if (err) {
                    stream.emit('error', err);
                    endStream();
                    return;
                }
                if (isEnded) {
                    return;
                }
                if (messages.length === 0) {
                    if (timeout && (Date.now() - lastMsgTime) > timeout) {
                        console.info('Consumer timeout expired, closing stream...');
                        endStream();
                    }
                    else {
                        setTimeout(() => consume(), 100);
                    }
                    return;
                }
                lastMsgTime = Date.now();
                const msgs = messages.map((m) => {
                    if (fullMessage) {
                        m.value = m.value.toString();
                        m.key = m.key ? m.key.toString() : null;
                        return JSON.stringify(m);
                    }
                    return m.value.toString();
                });
                msgs.map((m) => stream.push(m));
                nPushed += msgs.length;
                const lastMsg = messages[messages.length - 1];
                // If commit specified, commit up to the last message received
                if (commit) {
                    const cmt = {
                        topic: lastMsg.topic,
                        partition: lastMsg.partition,
                        offset: lastMsg.offset + 1
                    };
                    console.debug('committing ' + cmt.offset);
                    consumer.commit(cmt);
                }
                // Check for end of parition (if closeAtEnd is true) and end consumption
                if (closeAtEnd && (typeof endOfPartition === 'number') && lastMsg.offset >= endOfPartition - 1) {
                    console.info('End of partition, closing...');
                    endStream();
                    return false;
                }
                // If position.count is specified, end consumption when we've consumed the
                //  required amount
                if (position.count && nPushed >= position.count) {
                    console.info('KAFKA: reached end');
                    endStream();
                    return false;
                }
            });
        }
        function installSigintTerminate() {
            process.once('SIGINT', () => {
                process.stderr.write('\n');
                endStream();
            });
        }
        const stream = new tstream_1.Readable({
            objectMode: true,
            read: () => {
                if (isEnded) {
                    return;
                }
                if (!consumer.isConnected()) {
                    consumer.once('ready', () => {
                        consume();
                    });
                }
                else {
                    consume();
                }
            }
        });
        stream.on('error', (err) => {
            console.error('STREAM event: error');
            console.error(err);
            endStream();
        });
        stream.on('close', () => {
            console.debug('STREAM event: close');
            isEnded = true;
            disconnect(() => { });
        });
        stream.on('end', () => {
            console.debug('STREAM event: end');
            isEnded = true;
            stream.destroy();
        });
        stream._destroy = function (err, cb) {
            console.debug('_destroy');
            disconnect((e) => {
                if (e) {
                    cb(e);
                    return;
                }
                cb(err);
            });
        };
        function disconnect(cb) {
            if (consumer && consumer.isConnected()) {
                consumer.disconnect((err) => {
                    if (err) {
                        console.error(err);
                    }
                    console.info('Consumer disconnected');
                    cb(err);
                });
            }
            else {
                cb();
            }
        }
        const opts = {
            'client.id': 'kpipe',
            'metadata.broker.list': brokers,
            'group.id': groupid,
            'enable.auto.commit': false,
            // 'message.timeout.ms': 10000, (?? producer only)
            // 'auto.commit.interval.ms': 15,
            'socket.keepalive.enable': true,
            // 'debug': 'consumer,cgrp,topic,fetch',
            // 'enable.partition.eof': true
            'debug': ''
        };
        if (debug) {
            opts.debug = 'consumer,cgrp,topic,fetch';
        }
        const consumer = new node_rdkafka_1.KafkaConsumer(opts, {
            'auto.offset.reset': 'earliest' // 'latest',
        });
        consumer.on('event.log', (log) => {
            console.debug(log.message);
        });
        consumer.on('event.error', (err) => {
            stream.emit('error', err);
        });
        consumer.on('unsubscribed', () => {
            // Invalidate the stream when we unsubscribe
            endStream();
        });
        // consumer.setDefaultConsumeTimeout(1000)
        function cbConnect(err /*, metadata */) {
            if (err) {
                console.error('FAILED connect');
                stream.emit('error', err);
                return;
            }
            consumer.isConnecting = false;
            try {
                // Subscribe to the topics as well so we will be ready
                // If this throws the stream is invalid
                const off = topicConf(topic, position);
                if (off) {
                    console.info('CONSUMER assign: ', off);
                    consumer.queryWatermarkOffsets(topic, off.partition, 1000, (err, marks) => {
                        if (err) {
                            stream.emit('error', err);
                            return;
                        }
                        endOfPartition = marks.highOffset;
                        console.info('End of partition: ' + endOfPartition);
                        if (closeAtEnd && typeof off.offset === 'number' && endOfPartition <= off.offset) {
                            console.info('Partition does not contain offset and closeAtEnd is set -- ending stream');
                            endStream();
                            return;
                        }
                        consumer.assign([off]);
                    });
                }
                else {
                    console.info('CONSUMER subscribe: ', topic);
                    consumer.subscribe([topic]);
                    installSigintTerminate();
                }
                // start the flow of data
                stream.read();
            }
            catch (e) {
                stream.emit('error', e);
            }
        }
        consumer.isConnecting = true;
        consumer.connect({}, cbConnect);
        return stream;
    };
}
exports.bkKafka = bkKafka;
//# sourceMappingURL=kafka.js.map