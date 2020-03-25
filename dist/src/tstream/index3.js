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
const events_1 = require("events");
class Stream extends events_1.EventEmitter {
    constructor(...args) {
        super();
        this.stream = new NodeStream.Stream(...args);
    }
    pipe(destination, options) {
    }
}
class Readable extends Stream {
}
class Writable extends Stream {
}
class Duplex extends Readable {
}
class Transform extends Duplex {
}
class PassThrough extends Transform {
}
//# sourceMappingURL=index3.js.map