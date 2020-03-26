"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_typestream_1 = require("node-typestream");
const stream_tracker_1 = require("../stream-tracker");
function bkStdio(options) {
    return () => {
        return stream_tracker_1.StreamTracker(new node_typestream_1.Readable({
            stream: process.stdin
        }));
    };
    // return (): Readable<Buffer> => {
    //   const stream = new PassThrough<Buffer>({
    //     // autoClose: true
    //   })
    //   stream.on('end', () => {
    //     process.stdin.unpipe(stream as unknown as NodeJS.WritableStream)
    //   })
    //   process.stdin.pipe(stream as unknown as NodeJS.WritableStream)
    //   return stream
    // }
}
exports.bkStdio = bkStdio;
//# sourceMappingURL=stdio.js.map