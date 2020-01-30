"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
module.exports = function (options) {
    return () => {
        const stream = new stream_1.PassThrough({
        // autoClose: true
        });
        stream.on('end', () => {
            process.stdin.unpipe(stream);
        });
        process.stdin.pipe(stream);
        return stream;
    };
};
//# sourceMappingURL=stdio.js.map