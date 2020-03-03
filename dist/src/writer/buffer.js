"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstream_1 = require("../tstream");
function bkBuffer(options) {
    return (src) => {
        src = src || '';
        if (!Buffer.isBuffer(src) && typeof src !== 'string') {
            throw Error('supplied argument must be a buffer or string');
        }
        let _buffer = Buffer.from(src);
        const stream = new tstream_1.Writable({
            objectMode: false,
            write: (chunk, enc, cb) => {
                _buffer = Buffer.concat([_buffer, Buffer.from(chunk)]);
                cb();
            }
        });
        stream.on('finish', () => {
            stream.emit('buffer', _buffer);
        });
        return stream;
    };
}
exports.bkBuffer = bkBuffer;
//# sourceMappingURL=buffer.js.map