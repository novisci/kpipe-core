import * as NodeStream from 'stream'
import { EventEmitter } from 'events'

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

export type StreamCallback = (error?: Error | null) => void

class Stream<T> extends EventEmitter {
  private stream: NodeStream.Stream

  constructor (...args: any[]) {
    super()
    this.stream = new NodeStream.Stream(...args)
  }

  pipe<T extends NodeJS.WritableStream> (destination: T, options?: { end?: boolean }): T {
    
  }
}

class Readable<O> extends Stream<O> {

}

class Writable<I> extends Stream<I> {

}

class Duplex<I, O> extends Readable<O> implements Writable<I> {

}

class Transform<I, O> extends Duplex<I, O> {

}

class PassThrough<I> extends Transform<I, I> {

}

