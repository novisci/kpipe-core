"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bkStdio(options) {
    return () => {
        return process.stdout;
        // const stream = new PassThrough<Buffer>()
        // stream.on('finish', () => {
        //   stream.unpipe(process.stdout as unknown as Writable<Buffer>)
        // })
        // stream.pipe(process.stdout as unknown as Writable<Buffer>)
        // return stream
    };
}
exports.bkStdio = bkStdio;
//# sourceMappingURL=stdio.js.map