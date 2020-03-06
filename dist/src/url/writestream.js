"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writer_1 = require("./writer");
module.exports = function (url, { ...writerOpts } = {}) {
    const [writer, streamArgs] = writer_1.writerUrl(url, writerOpts);
    const stream = writer(...streamArgs());
    return stream;
};
//# sourceMappingURL=writestream.js.map