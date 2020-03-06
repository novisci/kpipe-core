import * as NodeStream from 'stream'

export type StreamCallback = (error?: Error | null) => void

type StreamContent = Buffer | string | {}

type TypedStream<S extends NodeStream.Stream, T> = [S, T]



export class Stream<T> extends NodeStream.Stream {
  constructor (opts = {}) {
    super(opts)
  }
}
export class Readable<Out> extends NodeStream.Readable implements NodeJS.ReadableStream {
  constructor (opts = {}) {
    super(opts)
  }

  // abstract _read (size: number): Out[]

  push (chunk: Out|null, encoding?: string): boolean {
    return super.push(chunk, encoding)
  }

  // pipe<NextDuplexOut> (destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>
  // pipe<NextTransformOut> (destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>
  // pipe (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>

  // pipe (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>
  pipe<Out> (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>
  pipe<T extends NodeJS.WritableStream> (destination: T, options?: { end?: boolean }): T {
    return super.pipe<T>(destination, options)
  }
}
