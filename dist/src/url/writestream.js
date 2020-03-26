"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writer_1 = require("./writer");
function writeStreamUrl(url, { ...writerOpts } = {}) {
    const [writer, streamArgs] = writer_1.writerUrl(url, writerOpts);
    const stream = writer(...streamArgs());
    return stream;
}
exports.writeStreamUrl = writeStreamUrl;
//# sourceMappingURL=writestream.js.map