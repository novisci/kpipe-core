"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstream_1 = require("../tstream");
function bkBuffer(options) {
    return (buffer) => {
        if (!Buffer.isBuffer(buffer)) {
            throw Error('supplied argument must be a buffer');
        }
        const stream = new tstream_1.Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    };
}
exports.bkBuffer = bkBuffer;
//# sourceMappingURL=buffer.js.map