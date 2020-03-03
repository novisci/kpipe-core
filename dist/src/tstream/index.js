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
    // pipe<NextDuplexOut> (destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>
    // pipe<NextTransformOut> (destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>
    // pipe (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>
    // pipe (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>
    pipe(destination, options) {
        return super.pipe(destination, options);
    }
}
exports.Readable = Readable;
class Writable extends NodeStream.Writable {
    constructor(opts = {}) {
        super(opts);
    }
}
exports.Writable = Writable;
class Duplex extends NodeStream.Duplex {
    constructor(opts = {}) {
        super(opts);
    }
    push(chunk, encoding) {
        return super.push(chunk, encoding);
    }
    // pipe<NextDuplexOut> (destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>;
    // pipe<NextTransformOut> (destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>;
    // pipe (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>;
    pipe(destination, options) {
        return super.pipe(destination, options);
    }
}
exports.Duplex = Duplex;
class Transform extends NodeStream.Transform {
    constructor(opts = {}) {
        super(opts);
    }
    push(chunk, encoding) {
        return super.push(chunk, encoding);
    }
    // pipe<NextDuplexOut>(destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>;
    // pipe<NextTransformOut>(destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>;
    // pipe(destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>;
    pipe(destination, options) {
        return super.pipe(destination, options);
    }
}
exports.Transform = Transform;
class PassThrough extends NodeStream.PassThrough {
    constructor(opts = {}) {
        super(opts);
    }
    push(chunk, encoding) {
        return super.push(chunk, encoding);
    }
    // pipe<NextDuplexOut>(destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>;
    // pipe<NextTransformOut>(destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>;
    // pipe(destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>;
    pipe(destination, options) {
        return super.pipe(destination, options);
    }
}
exports.PassThrough = PassThrough;
//# sourceMappingURL=index.js.map