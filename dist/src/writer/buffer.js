"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_typestream_1 = require("node-typestream");
function bkBuffer(options) {
    return (src) => {
        src = src || '';
        if (!Buffer.isBuffer(src) && typeof src !== 'string') {
            throw Error('supplied argument must be a buffer or string');
        }
        let _buffer = Buffer.from(src);
        const stream = new node_typestream_1.Writable({
            objectMode: false,
            write: (chunk, enc, cb) => {
                _buffer = Buffer.concat([_buffer, Buffer.from(chunk)]);
                cb();
            }
        });
        stream.on('finish', () => {
            if (options.cbBuffer) {
                options.cbBuffer(_buffer);
            }
        });
        return stream;
    };
}
exports.bkBuffer = bkBuffer;
//# sourceMappingURL=buffer.js.map