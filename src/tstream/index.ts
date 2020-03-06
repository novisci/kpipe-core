import * as NodeStream from 'stream'

export type StreamCallback = (error?: Error | null) => void

export class Stream<T> extends NodeStream.Stream {
  constructor (opts = {}) {
    super(opts)
  }
}
export class Readable<Out> extends NodeStream.Readable {
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
  // pipe<Out> (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>
  // pipe (destination: Writable<Out>, options?: { end?: boolean}): Writable<Out>
  // pipe<NextDuplexOut> (destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>

  // pipe (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out> {
  //   return super.pipe(destination, options)
  // }
  // pipe<Writable<Out>> (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>

  pipe<T extends NodeJS.WritableStream> (destination: T, options?: { end?: boolean }): T {
    return super.pipe(destination, options)
  }
}

export class Writable<In> extends NodeStream.Writable {
  constructor (opts = {}) {
    super(opts)
  }

  write (chunk: In, encoding: string, callback: Function): void {
    super.write(chunk, encoding, callback)
  }

  // abstract _write(chunk: In, encoding: string, callback: Function): void;
}

export class Duplex<In, Out> extends NodeStream.Duplex {
  constructor (opts = {}) {
    super(opts)
  }

  push (chunk: Out|null, encoding?: string): boolean {
    return super.push(chunk, encoding)
  }

  // pipe<NextDuplexOut> (destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>;
  // pipe<NextTransformOut> (destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>;
  // pipe (destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>;
  pipe<T extends NodeJS.WritableStream> (destination: T, options?: { end?: boolean }): T {
    return super.pipe(destination, options)
  }
}

export class Transform<In, Out> extends NodeStream.Transform {
  constructor (opts = {}) {
    super(opts)
  }

  push (chunk: Out|null, encoding?: string): boolean {
    return super.push(chunk, encoding)
  }

  // pipe<NextDuplexOut>(destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>;
  // pipe<NextTransformOut>(destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>;
  // pipe(destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>;
  pipe<T extends NodeJS.WritableStream> (destination: T, options?: { end?: boolean }): T {
    return super.pipe(destination, options)
  }
}

export class PassThrough<Out> extends NodeStream.PassThrough {
  constructor (opts = {}) {
    super(opts)
  }

  push (chunk: Out|null, encoding?: string): boolean {
    return super.push(chunk, encoding)
  }

  // pipe<NextDuplexOut>(destination: Duplex<Out, NextDuplexOut>, options?: { end?: boolean }): Duplex<Out, NextDuplexOut>;
  // pipe<NextTransformOut>(destination: Transform<Out, NextTransformOut>, options?: { end?: boolean }): Transform<Out, NextTransformOut>;
  // pipe(destination: Writable<Out>, options?: { end?: boolean }): Writable<Out>;
  pipe<T extends NodeJS.WritableStream> (destination: T, options?: { end?: boolean }): T {
    return super.pipe(destination, options)
  }
}
