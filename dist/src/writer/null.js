"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstream_1 = require("../tstream");
function bkNull(options) {
    return () => {
        const stream = new tstream_1.Writable({
            write: (chunk, enc, cb) => {
                cb();
            }
        });
        return stream;
    };
}
exports.bkNull = bkNull;
//# sourceMappingURL=null.js.map