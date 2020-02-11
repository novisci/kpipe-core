"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstream_1 = require("tstream");
function default_1() {
    return () => {
        const stream = new tstream_1.Writable({
            write: (chunk, enc, cb) => {
                cb();
            }
        });
        return stream;
    };
}
exports.default = default_1;
//# sourceMappingURL=null.js.map