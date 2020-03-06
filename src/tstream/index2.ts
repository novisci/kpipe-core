import * as NodeStream from 'stream'

export type StreamCallback = (error?: Error | null) => void

export type BaseContent = Buffer | string | {}

// export class Stream<T> {
//   pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T
// }
// export interface Stream<T> extends NodeStream.Stream, 

interface ReadableOptions<T> {
  highWaterMark?: number
  encoding?: string
  objectMode?: boolean
  read?(this: Readable<T>, size: number): void
  destroy?(this: Readable<T>, error: Error | null, callback: (error: Error | null) => void): void
  autoDestroy?: boolean
}

export function StreamClass<S, T> (): any {
  return class {
    stream: S

    constructor (opts?: ReadableOptions<T>) {
      this.stream = new (class S)(opts)
    }
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T
  }
}

function Readable<T> (opts?: ReadableOptions<T>) {
  return new (StreamClass<NodeStream.Readable, T>())(opts)
}

// export function Readable<Out extends (Buffer | string | {})> (...args: any[]) {

// }

// class InputType<T> {
//   out: string
//   constructor () {
//     this.out = this.constructor.toString().match(/\w+/g)[1]
//   }
// }

// class OutputType<T> {

// }

// interface Stream<T> extends NodeStream.Stream, OutputType<T>
// applyMixins(Stream<T>)

function applyMixins (derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name))
    })
  })
}
