import { PassThrough, Readable } from 'node-typestream'
import { ReadableStreamGenerator } from '../backend'
import { StreamTracker } from '../stream-tracker'

export function bkStdio (options?: {}): ReadableStreamGenerator<Buffer> {
  return (): Readable<Buffer> => {
    return StreamTracker(new Readable<Buffer>({
      stream: process.stdin
    }))
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
