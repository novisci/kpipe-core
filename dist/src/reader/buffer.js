"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
module.exports = function (options) {
    options = options || {};
    return (buffer) => {
        if (!Buffer.isBuffer(buffer)) {
            throw Error('supplied argument must be a buffer');
        }
        let stream = new stream_1.Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    };
};
//# sourceMappingURL=buffer.js.map