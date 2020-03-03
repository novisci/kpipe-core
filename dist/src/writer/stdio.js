"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstream_1 = require("../tstream");
function bkStdio(options) {
    return () => {
        const stream = new tstream_1.PassThrough();
        stream.on('finish', () => {
            stream.unpipe(process.stdout);
        });
        stream.pipe(process.stdout);
        return stream;
    };
}
exports.bkStdio = bkStdio;
//# sourceMappingURL=stdio.js.map