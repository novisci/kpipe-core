"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("./fs");
const s3_1 = require("./s3");
const stdio_1 = require("./stdio");
const kafka_1 = require("./kafka");
const buffer_1 = require("./buffer");
const null_1 = require("./null");
const writerBackends = ['fs', 's3', 'stdio', 'kafka', 'buffer', 'null'];
function isWriterBackend(s) {
    if (writerBackends.includes(s)) {
        return true;
    }
    return false;
}
exports.isWriterBackend = isWriterBackend;
function Writer({ type, ...options } = { type: 'buffer' }) {
    if (!type) {
        throw new Error('No writer backend specified in options.type');
    }
    // Backend writers return a function which creates new writable streams
    //  given a path
    let backend;
    switch (type) {
        case 'fs':
            backend = fs_1.bkFs(options);
            break;
        case 's3':
            backend = s3_1.bkS3(options);
            break;
        case 'stdio':
            backend = stdio_1.bkStdio(options);
            break;
        case 'kafka':
            backend = kafka_1.bkKafka(options);
            break;
        case 'buffer':
            backend = buffer_1.bkBuffer(options);
            break;
        case 'null':
            backend = null_1.bkNull(options);
            break;
        default: throw new Error(`Unknown writer type "${type}`);
    }
    return backend;
}
exports.Writer = Writer;
//# sourceMappingURL=index.js.map