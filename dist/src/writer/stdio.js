"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
module.exports = function (options) {
    return () => {
        const stream = new stream_1.PassThrough();
        stream.on('finish', () => {
            stream.unpipe(process.stdout);
        });
        stream.pipe(process.stdout);
        return stream;
    };
};
//# sourceMappingURL=stdio.js.map