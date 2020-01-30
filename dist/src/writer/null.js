"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
module.exports = function (options) {
    options = options || {};
    return () => {
        const stream = new stream_1.Writable({
            write: (chunk, enc, cb) => {
                cb();
            }
        });
        return stream;
    };
};
//# sourceMappingURL=null.js.map