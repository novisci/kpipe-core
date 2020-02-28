"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// declare module 'tstream' {
const stream = __importStar(require("stream"));
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// class internal extends stream {
//   pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T {
//     return super.
//   }
// }
// namespace internal {
class Stream extends stream.Stream {
    constructor(opts) {
        super(opts);
    }
}
exports.Stream = Stream;
class Readable extends stream.Readable {
    /**
     * A utility method for creating Readable Streams out of iterators.
     */
    static from(iterable, options) {
        return super.from(iterable, options);
    }
    // readable: boolean;
    // readonly readableHighWaterMark: number;
    // readonly readableLength: number;
    // readonly readableObjectMode: boolean;
    // destroyed: boolean;
    constructor(opts) {
        super(opts);
    }
    // _read(size: number): void;
    read(size) {
        return super.read(size);
    }
    // setEncoding(encoding: string): this;
    // pause(): this;
    // resume(): this;
    // isPaused(): boolean;
    // unpipe(destination?: NodeJS.WritableStream): this;
    unshift(chunk, encoding) {
        super.unshift(chunk, encoding);
    }
    // wrap(oldStream: NodeJS.ReadableStream): this;
    push(chunk, encoding) {
        return super.push(chunk, encoding);
    }
}
exports.Readable = Readable;
class Writable extends stream.Writable {
    // readonly writable: boolean;
    // readonly writableEnded: boolean;
    // readonly writableFinished: boolean;
    // readonly writableHighWaterMark: number;
    // readonly writableLength: number;
    // readonly writableObjectMode: boolean;
    // readonly writableCorked: number;
    // destroyed: boolean;
    // constructor(opts?: WritableOptions<T>) {
    //   super(opts)
    // }
    _write(chunk, encoding, callback) {
        return super._write(chunk, encoding, callback);
    }
    _writev(chunks, callback) {
        if (super._writev) {
            super._writev(chunks, callback);
        }
    }
    // _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
    // _final(callback: (error?: Error | null) => void): void;
    // write (chunk: T, cb?: (error: Error | null | undefined) => void): boolean;
    write(chunk, encoding, cb) {
        return super.write(chunk, encoding, cb);
    }
    // setDefaultEncoding(encoding: string): this;
    // end (cb?: () => void): void;
    // end (chunk: T, cb?: () => void): void;
    end(chunk, encoding, cb) {
        super.end(chunk, encoding, cb);
    }
}
exports.Writable = Writable;
// Note: Duplex extends both Readable and Writable.
class Duplex extends stream.Duplex {
    // readonly writable: boolean;
    // readonly writableEnded: boolean;
    // readonly writableFinished: boolean;
    // readonly writableHighWaterMark: number;
    // readonly writableLength: number;
    // readonly writableObjectMode: boolean;
    // readonly writableCorked: number;
    // constructor(opts?: DuplexOptions<S, T>) {
    //   super(opts)
    // }
    _write(chunk, encoding, callback) {
        super._write(chunk, encoding, callback);
    }
    _writev(chunks, callback) {
        if (super._writev) {
            super._writev(chunks, callback);
        }
    }
    // _destroy(error: Error | null, callback: (error: Error | null) => void): void;
    // _final(callback: (error?: Error | null) => void): void;
    // write (chunk: S, cb?: (error: Error | null | undefined) => void): boolean
    write(chunk, encoding, cb) {
        return super.write(chunk, encoding, cb);
    }
    // setDefaultEncoding(encoding: string): this;
    // end (cb?: () => void): void;
    // end (chunk: S, cb?: () => void): void;
    end(chunk, encoding, cb) {
        super.end(chunk, encoding, cb);
    }
}
exports.Duplex = Duplex;
class Transform extends stream.Transform {
    // constructor(opts?: TransformOptions<S, T>) {
    //   super(opts)
    // }
    _transform(chunk, encoding, callback) {
        super._transform(chunk, encoding, callback);
    }
    _flush(callback) {
        super._flush(callback);
    }
}
exports.Transform = Transform;
class PassThrough extends Transform {
}
exports.PassThrough = PassThrough;
// }
// export = internal
// }
//# sourceMappingURL=index.js.map