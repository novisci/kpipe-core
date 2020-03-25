import { PassThrough, Readable } from 'node-typestream'
import { ReadableStreamGenerator } from '../backend'

export function bkStdio (options?: {}): ReadableStreamGenerator<Buffer> {
  return (): Readable<Buffer> => {
    return process.stdin as unknown as Readable<Buffer>
  }
  // return (): Readable<Buffer> => {
  //   const stream = new PassThrough<Buffer>({
  //     // autoClose: true
  //   })
  //   stream.on('end', () => {
  //     process.stdin.unpipe(stream as unknown as NodeJS.WritableStream)
  //   })
  //   process.stdin.pipe(stream as unknown as NodeJS.WritableStream)
  //   return stream
  // }
}
