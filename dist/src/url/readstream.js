"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("./reader");
module.exports = function (url, { ...readerOpts } = {}) {
    const [reader, streamArgs] = reader_1.readerUrl(url, readerOpts);
    const stream = reader(...streamArgs());
    return stream;
};
//# sourceMappingURL=readstream.js.map