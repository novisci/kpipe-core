"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
function default_1() {
    return (buffer) => {
        if (!Buffer.isBuffer(buffer)) {
            throw Error('supplied argument must be a buffer');
        }
        const stream = new stream_1.Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    };
}
exports.default = default_1;
//# sourceMappingURL=buffer.js.map