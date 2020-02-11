"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstream_1 = require("tstream");
function default_1() {
    return () => {
        const stream = new tstream_1.PassThrough();
        stream.on('finish', () => {
            stream.unpipe(process.stdout);
        });
        stream.pipe(process.stdout);
        return stream;
    };
}
exports.default = default_1;
//# sourceMappingURL=stdio.js.map