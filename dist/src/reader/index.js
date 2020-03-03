"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("./fs");
const s3_1 = require("./s3");
const stdio_1 = require("./stdio");
const kafka_1 = require("./kafka");
const buffer_1 = require("./buffer");
const random_1 = require("./random");
function Reader({ type, ...options } = { type: 'buffer' }) {
    if (!type) {
        throw new Error('No reader backend specified in options.type');
    }
    // Backend readers return a function which creates new readable streams
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
        case 'random':
            backend = random_1.bkRandom(options);
            break;
        default: throw new Error(`Unknown reader type "${type}`);
    }
    return backend;
}
exports.Reader = Reader;
//# sourceMappingURL=index.js.map