"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
function default_1() {
    return () => {
        const stream = new stream_1.Writable({
            write: (chunk, enc, cb) => {
                cb();
            }
        });
        return stream;
    };
}
exports.default = default_1;
//# sourceMappingURL=null.js.map