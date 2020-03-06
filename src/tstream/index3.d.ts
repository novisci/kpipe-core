declare module 'tstream' {
  import * as NodeStream from 'stream'
  import * as events from 'events'

  /*
      interface ReadableStream extends EventEmitter {
          readable: boolean;
          read(size?: number): string | Buffer;
          setEncoding(encoding: string): this;
          pause(): this;
          resume(): this;
          isPaused(): boolean;
          pipe<T extends WritableStream>(destination: T, options?: { end?: boolean; }): T;
          unpipe(destination?: WritableStream): this;
          unshift(chunk: string | Uint8Array, encoding?: BufferEncoding): void;
          wrap(oldStream: ReadableStream): this;
          [Symbol.asyncIterator](): AsyncIterableIterator<string | Buffer>;
      }

      interface WritableStream extends EventEmitter {
          writable: boolean;
          write(buffer: Uint8Array | string, cb?: (err?: Error | null) => void): boolean;
          write(str: string, encoding?: string, cb?: (err?: Error | null) => void): boolean;
          end(cb?: () => void): void;
          end(data: string | Uint8Array, cb?: () => void): void;
          end(str: string, encoding?: string, cb?: () => void): void;
      }

      interface ReadWriteStream extends ReadableStream, WritableStream { }
  */

  // declare class tstream extends events.EventEmitter {
  //   pipe<T extends tstream.Writable<I>> (destination: T, options?: { end?: boolean }): T
  // }

  namespace tstream {
    class Stream<O> extends events.EventEmitter {
      private stream: NodeStream.Stream
    
      constructor (...args: any[])
    
      pipe<I> (destination: Writable<I>, options?: { end?: boolean }): Writable<I>
    }
    
    interface ReadableOptions<O> {
      highWaterMark?: number
      encoding?: string
      objectMode?: boolean
      read?(this: Readable<O>, size: number): void
      destroy?(this: Readable<O>, error: Error | null, callback: (error: Error | null) => void): void
      autoDestroy?: boolean
    }

    class Readable<O> extends Stream<O> {
      constructor (opts?: ReadableOptions<O>)
    }
    
    interface WritableOptions<I> {
      highWaterMark?: number;
      decodeStrings?: boolean;
      defaultEncoding?: string;
      objectMode?: boolean;
      emitClose?: boolean;
      write?(this: Writable<I>, chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
      writev?(this: Writable<I>, chunks: Array<{ chunk: any, encoding: string }>, callback: (error?: Error | null) => void): void;
      destroy?(this: Writable<I>, error: Error | null, callback: (error: Error | null) => void): void;
      final?(this: Writable<I>, callback: (error?: Error | null) => void): void;
      autoDestroy?: boolean;
    }

    class Writable<I> extends Stream<I> {
      constructor (opts?: WritableOptions<I>)
    }
    
    class Duplex<I, O> extends Readable<O> implements Writable<I> {
    
    }
    
    class Transform<I, O> extends Duplex<I, O> {
    
    }
    
    class PassThrough<I> extends Transform<I, I> {
    
    }
  }

  export = tstream
}
