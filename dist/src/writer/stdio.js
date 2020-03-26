"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_typestream_1 = require("node-typestream");
function bkStdio(options) {
    return () => {
        // return process.stdout as unknown as Writable<Buffer>
        // const stream = new PassThrough<Buffer>()
        // stream.on('finish', () => {
        //   stream.unpipe(process.stdout as unknown as Writable<Buffer>)
        // })
        // stream.pipe(process.stdout as unknown as Writable<Buffer>)
        // return stream
        return new node_typestream_1.Writable({
            stream: process.stdout
        });
    };
}
exports.bkStdio = bkStdio;
//# sourceMappingURL=stdio.js.map