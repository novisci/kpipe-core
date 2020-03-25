"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_typestream_1 = require("node-typestream");
function bkNull(options) {
    return () => {
        const stream = new node_typestream_1.Writable({
            write: (chunk, enc, cb) => {
                cb();
            }
        });
        return stream;
    };
}
exports.bkNull = bkNull;
//# sourceMappingURL=null.js.map