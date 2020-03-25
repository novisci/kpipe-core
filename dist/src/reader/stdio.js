"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bkStdio(options) {
    return () => {
        return process.stdin;
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