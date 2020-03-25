"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeStream = __importStar(require("stream"));
class Stream extends NodeStream.Stream {
    constructor(opts = {}) {
        super(opts);
    }
}
exports.Stream = Stream;
class Readable extends NodeStream.Readable {
    constructor(opts = {}) {
        super(opts);
    }
    // abstract _read (size: number): Out[]
    push(chunk, encoding) {
        return super.push(chunk, encoding);
    }
    pipe(destination, options) {
        return super.pipe(destination, options);
    }
}
exports.Readable = Readable;
//# sourceMappingURL=_index.js.map