// declare module 'tstream' {
//   import * as stream from 'stream'
//   import * as events from 'events'

//   // type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

//   class internal extends stream {
//     pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T;
//   }

//   namespace internal {

//     class Stream<T> extends internal {
//       constructor(opts?: ReadableOptions<T>);
//     }
    
//     interface ReadableOptions<T> extends stream.ReadableOptions {
//       highWaterMark?: number;
//       encoding?: string;
//       objectMode?: boolean;
//       read?(this: Readable<T>, size: number): void;
//       destroy?(this: Readable<T>, error: Error | null, callback: (error: Error | null) => void): void;
//       autoDestroy?: boolean;
//     }

//     class Readable<T = Buffer> extends Stream<T> implements stream.Readable {
//       /**
//        * A utility method for creating Readable Streams out of iterators.
//        */
//       static from<T>(iterable: Iterable<T> | AsyncIterable<T>, options?: ReadableOptions<T>): Readable<T>;

//       readable: boolean;
//       readonly readableHighWaterMark: number;
//       readonly readableLength: number;
//       readonly readableObjectMode: boolean;
//       destroyed: boolean;
//       constructor(opts?: ReadableOptions<T>);
//       _read(size: number): void;
//       read<T>(size?: number): T;
//       setEncoding(encoding: string): this;
//       pause(): this;
//       resume(): this;
//       isPaused(): boolean;
//       unpipe(destination?: NodeJS.WritableStream): this;
//       unshift<T>(chunk: T, encoding?: BufferEncoding): void;
//       wrap(oldStream: NodeJS.ReadableStream): this;
//       push(chunk: T | null, encoding?: string): boolean;
//       _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
//       destroy(error?: Error): void;

//       /**
//        * Event emitter
//        * The defined events on documents including:
//        * 1. close
//        * 2. data
//        * 3. end
//        * 4. readable
//        * 5. error
//        */
//       addListener(event: "close", listener: () => void): this;
//       addListener(event: "data", listener: (chunk: T) => void): this;
//       addListener(event: "end", listener: () => void): this;
//       addListener(event: "readable", listener: () => void): this;
//       addListener(event: "error", listener: (err: Error) => void): this;
//       addListener(event: string | symbol, listener: (...args: any[]) => void): this;

//       emit(event: "close"): boolean;
//       emit(event: "data", chunk: T): boolean;
//       emit(event: "end"): boolean;
//       emit(event: "readable"): boolean;
//       emit(event: "error", err: Error): boolean;
//       emit(event: string | symbol, ...args: any[]): boolean;

//       on(event: "close", listener: () => void): this;
//       on(event: "data", listener: (chunk: T) => void): this;
//       on(event: "end", listener: () => void): this;
//       on(event: "readable", listener: () => void): this;
//       on(event: "error", listener: (err: Error) => void): this;
//       on(event: string | symbol, listener: (...args: any[]) => void): this;

//       once(event: "close", listener: () => void): this;
//       once(event: "data", listener: (chunk: T) => void): this;
//       once(event: "end", listener: () => void): this;
//       once(event: "readable", listener: () => void): this;
//       once(event: "error", listener: (err: Error) => void): this;
//       once(event: string | symbol, listener: (...args: any[]) => void): this;

//       prependListener(event: "close", listener: () => void): this;
//       prependListener(event: "data", listener: (chunk: T) => void): this;
//       prependListener(event: "end", listener: () => void): this;
//       prependListener(event: "readable", listener: () => void): this;
//       prependListener(event: "error", listener: (err: Error) => void): this;
//       prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

//       prependOnceListener(event: "close", listener: () => void): this;
//       prependOnceListener(event: "data", listener: (chunk: T) => void): this;
//       prependOnceListener(event: "end", listener: () => void): this;
//       prependOnceListener(event: "readable", listener: () => void): this;
//       prependOnceListener(event: "error", listener: (err: Error) => void): this;
//       prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

//       removeListener(event: "close", listener: () => void): this;
//       removeListener(event: "data", listener: (chunk: T) => void): this;
//       removeListener(event: "end", listener: () => void): this;
//       removeListener(event: "readable", listener: () => void): this;
//       removeListener(event: "error", listener: (err: Error) => void): this;
//       removeListener(event: string | symbol, listener: (...args: any[]) => void): this;

//       off(event: string | symbol, listener: (...args: any[]) => void): this;
//       removeAllListeners(event?: string | symbol): this;
//       setMaxListeners(n: number): this;
//       getMaxListeners(): number;

//       [Symbol.asyncIterator](): AsyncIterableIterator<any>;
//     }

//     interface WritableOptions<T> extends stream.WritableOptions {
//       highWaterMark?: number;
//       decodeStrings?: boolean;
//       defaultEncoding?: string;
//       objectMode?: boolean;
//       emitClose?: boolean;
//       write?(this: Writable<T>, chunk: T, encoding: string, callback: (error?: Error | null) => void): void;
//       writev?(this: Writable<T>, chunks: Array<{ chunk: T, encoding: string }>, callback: (error?: Error | null) => void): void;
//       destroy?(this: Writable<T>, error: Error | null, callback: (error: Error | null) => void): void;
//       final?(this: Writable<T>, callback: (error?: Error | null) => void): void;
//       autoDestroy?: boolean;
//     }

//     class Writable<T = Buffer> extends Stream<T> implements stream.Writable {
//       readonly writable: boolean;
//       readonly writableEnded: boolean;
//       readonly writableFinished: boolean;
//       readonly writableHighWaterMark: number;
//       readonly writableLength: number;
//       readonly writableObjectMode: boolean;
//       readonly writableCorked: number;
//       destroyed: boolean;
//       constructor(opts?: WritableOptions<T>);
//       _write(chunk: T, encoding: string, callback: (error?: Error | null) => void): void;
//       _writev?(chunks: Array<{ chunk: T, encoding: string }>, callback: (error?: Error | null) => void): void;
//       _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
//       _final(callback: (error?: Error | null) => void): void;
//       write<T>(chunk: T, cb?: (error: Error | null | undefined) => void): boolean;
//       write<T>(chunk: T, encoding: string, cb?: (error: Error | null | undefined) => void): boolean;
//       setDefaultEncoding(encoding: string): this;
//       end<T>(cb?: () => void): void;
//       end<T>(chunk: T, cb?: () => void): void;
//       end<T>(chunk: T, encoding: string, cb?: () => void): void;
//       cork(): void;
//       uncork(): void;
//       destroy(error?: Error): void;

//       /**
//        * Event emitter
//        * The defined events on documents including:
//        * 1. close
//        * 2. drain
//        * 3. error
//        * 4. finish
//        * 5. pipe
//        * 6. unpipe
//        */
//       addListener(event: "close", listener: () => void): this;
//       addListener(event: "drain", listener: () => void): this;
//       addListener(event: "error", listener: (err: Error) => void): this;
//       addListener(event: "finish", listener: () => void): this;
//       addListener(event: "pipe", listener: (src: Readable<T>) => void): this;
//       addListener(event: "unpipe", listener: (src: Readable<T>) => void): this;
//       addListener(event: string | symbol, listener: (...args: any[]) => void): this;

//       emit(event: "close"): boolean;
//       emit(event: "drain"): boolean;
//       emit(event: "error", err: Error): boolean;
//       emit(event: "finish"): boolean;
//       emit(event: "pipe", src: Readable<T>): boolean;
//       emit(event: "unpipe", src: Readable<T>): boolean;
//       emit(event: string | symbol, ...args: any[]): boolean;

//       on(event: "close", listener: () => void): this;
//       on(event: "drain", listener: () => void): this;
//       on(event: "error", listener: (err: Error) => void): this;
//       on(event: "finish", listener: () => void): this;
//       on(event: "pipe", listener: (src: Readable<T>) => void): this;
//       on(event: "unpipe", listener: (src: Readable<T>) => void): this;
//       on(event: string | symbol, listener: (...args: any[]) => void): this;

//       once(event: "close", listener: () => void): this;
//       once(event: "drain", listener: () => void): this;
//       once(event: "error", listener: (err: Error) => void): this;
//       once(event: "finish", listener: () => void): this;
//       once(event: "pipe", listener: (src: Readable<T>) => void): this;
//       once(event: "unpipe", listener: (src: Readable<T>) => void): this;
//       once(event: string | symbol, listener: (...args: any[]) => void): this;

//       prependListener(event: "close", listener: () => void): this;
//       prependListener(event: "drain", listener: () => void): this;
//       prependListener(event: "error", listener: (err: Error) => void): this;
//       prependListener(event: "finish", listener: () => void): this;
//       prependListener(event: "pipe", listener: (src: Readable<T>) => void): this;
//       prependListener(event: "unpipe", listener: (src: Readable<T>) => void): this;
//       prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

//       prependOnceListener(event: "close", listener: () => void): this;
//       prependOnceListener(event: "drain", listener: () => void): this;
//       prependOnceListener(event: "error", listener: (err: Error) => void): this;
//       prependOnceListener(event: "finish", listener: () => void): this;
//       prependOnceListener(event: "pipe", listener: (src: Readable<T>) => void): this;
//       prependOnceListener(event: "unpipe", listener: (src: Readable<T>) => void): this;
//       prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

//       removeListener(event: "close", listener: () => void): this;
//       removeListener(event: "drain", listener: () => void): this;
//       removeListener(event: "error", listener: (err: Error) => void): this;
//       removeListener(event: "finish", listener: () => void): this;
//       removeListener(event: "pipe", listener: (src: Readable<T>) => void): this;
//       removeListener(event: "unpipe", listener: (src: Readable<T>) => void): this;
//       removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
//     }

//     interface DuplexOptions<S, T> extends ReadableOptions<T>, WritableOptions<S> {
//       allowHalfOpen?: boolean;
//       readableObjectMode?: boolean;
//       writableObjectMode?: boolean;
//       readableHighWaterMark?: number;
//       writableHighWaterMark?: number;
//       writableCorked?: number;
//       read?(this: Duplex<S, T>, size: number): void;
//       write?(this: Duplex<S, T>, chunk: S, encoding: string, callback: (error?: Error | null) => void): void;
//       writev?(this: Duplex<S, T>, chunks: Array<{ chunk: S, encoding: string }>, callback: (error?: Error | null) => void): void;
//       final?(this: Duplex<S, T>, callback: (error?: Error | null) => void): void;
//       destroy?(this: Duplex<S, T>, error: Error | null, callback: (error: Error | null) => void): void;
//     }

//     // Note: Duplex extends both Readable and Writable.
//     class Duplex<S, T> extends Readable<T> implements Writable<S> {
//       readonly writable: boolean;
//       readonly writableEnded: boolean;
//       readonly writableFinished: boolean;
//       readonly writableHighWaterMark: number;
//       readonly writableLength: number;
//       readonly writableObjectMode: boolean;
//       readonly writableCorked: number;
//       constructor(opts?: DuplexOptions<S, T>);
//       _write(chunk: S, encoding: string, callback: (error?: Error | null) => void): void;
//       _writev?(chunks: Array<{ chunk: S, encoding: string }>, callback: (error?: Error | null) => void): void;
//       _destroy(error: Error | null, callback: (error: Error | null) => void): void;
//       _final(callback: (error?: Error | null) => void): void;
//       write(chunk: S, encoding?: string, cb?: (error: Error | null | undefined) => void): boolean;
//       write(chunk: S, cb?: (error: Error | null | undefined) => void): boolean;
//       setDefaultEncoding(encoding: string): this;
//       end(cb?: () => void): void;
//       end(chunk: S, cb?: () => void): void;
//       end(chunk: S, encoding?: string, cb?: () => void): void;
//       cork(): void;
//       uncork(): void;
//     }

//     type TransformCallback<T> = (error?: Error | null, data?: T) => void;

//     interface TransformOptions<S, T> extends DuplexOptions<S, T> {
//       read?(this: Transform<S, T>, size: number): void;
//       write?(this: Transform<S, T>, chunk: S, encoding: string, callback: (error?: Error | null) => void): void;
//       writev?(this: Transform<S, T>, chunks: Array<{ chunk: S, encoding: string }>, callback: (error?: Error | null) => void): void;
//       final?(this: Transform<S, T>, callback: (error?: Error | null) => void): void;
//       destroy?(this: Transform<S, T>, error: Error | null, callback: (error: Error | null) => void): void;
//       transform?(this: Transform<S, T>, chunk: S, encoding: string, callback: TransformCallback<T>): void;
//       flush?(this: Transform<S, T>, callback: TransformCallback<T>): void;
//     }

//     class Transform<S, T> extends Duplex<S, T> {
//       constructor(opts?: TransformOptions<S, T>);
//       _transform(chunk: S, encoding: string, callback: TransformCallback<T>): void;
//       _flush(callback: TransformCallback<T>): void;
//     }

//     class PassThrough<T> extends Transform<T, T> { }

//   //   function finished(stream: NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream, callback: (err?: NodeJS.ErrnoException | null) => void): () => void;
//   //   namespace finished {
//   //       function __promisify__(stream: NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream): Promise<void>;
//   //   }

//   //   function pipeline<T extends NodeJS.WritableStream>(stream1: NodeJS.ReadableStream, stream2: T, callback?: (err: NodeJS.ErrnoException | null) => void): T;
//   //   function pipeline<T extends NodeJS.WritableStream>(stream1: NodeJS.ReadableStream, stream2: NodeJS.ReadWriteStream, stream3: T, callback?: (err: NodeJS.ErrnoException | null) => void): T;
//   //   function pipeline<T extends NodeJS.WritableStream>(
//   //       stream1: NodeJS.ReadableStream,
//   //       stream2: NodeJS.ReadWriteStream,
//   //       stream3: NodeJS.ReadWriteStream,
//   //       stream4: T,
//   //       callback?: (err: NodeJS.ErrnoException | null) => void,
//   //   ): T;
//   //   function pipeline<T extends NodeJS.WritableStream>(
//   //       stream1: NodeJS.ReadableStream,
//   //       stream2: NodeJS.ReadWriteStream,
//   //       stream3: NodeJS.ReadWriteStream,
//   //       stream4: NodeJS.ReadWriteStream,
//   //       stream5: T,
//   //       callback?: (err: NodeJS.ErrnoException | null) => void,
//   //   ): T;
//   //   function pipeline(streams: Array<NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream>, callback?: (err: NodeJS.ErrnoException | null) => void): NodeJS.WritableStream;
//   //   function pipeline(
//   //       stream1: NodeJS.ReadableStream,
//   //       stream2: NodeJS.ReadWriteStream | NodeJS.WritableStream,
//   //       ...streams: Array<NodeJS.ReadWriteStream | NodeJS.WritableStream | ((err: NodeJS.ErrnoException | null) => void)>,
//   //   ): NodeJS.WritableStream;
//   //   namespace pipeline {
//   //       function __promisify__(stream1: NodeJS.ReadableStream, stream2: NodeJS.WritableStream): Promise<void>;
//   //       function __promisify__(stream1: NodeJS.ReadableStream, stream2: NodeJS.ReadWriteStream, stream3: NodeJS.WritableStream): Promise<void>;
//   //       function __promisify__(stream1: NodeJS.ReadableStream, stream2: NodeJS.ReadWriteStream, stream3: NodeJS.ReadWriteStream, stream4: NodeJS.WritableStream): Promise<void>;
//   //       function __promisify__(
//   //           stream1: NodeJS.ReadableStream,
//   //           stream2: NodeJS.ReadWriteStream,
//   //           stream3: NodeJS.ReadWriteStream,
//   //           stream4: NodeJS.ReadWriteStream,
//   //           stream5: NodeJS.WritableStream,
//   //       ): Promise<void>;
//   //       function __promisify__(streams: Array<NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream>): Promise<void>;
//   //       function __promisify__(
//   //           stream1: NodeJS.ReadableStream,
//   //           stream2: NodeJS.ReadWriteStream | NodeJS.WritableStream,
//   //           ...streams: Array<NodeJS.ReadWriteStream | NodeJS.WritableStream>,
//   //       ): Promise<void>;
//   //   }

//     interface Pipe {
//         close(): void;
//         hasRef(): boolean;
//         ref(): void;
//         unref(): void;
//     }
//   }

//   export = internal
// }