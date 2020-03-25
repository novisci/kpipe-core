import { PassThrough, Writable } from 'node-typestream'
import { WritableStreamGenerator } from '../backend'

export function bkStdio (options?: {}): WritableStreamGenerator<Buffer> {
  return (): Writable<Buffer> => {
    return process.stdout as unknown as Writable<Buffer>
    // const stream = new PassThrough<Buffer>()
    // stream.on('finish', () => {
    //   stream.unpipe(process.stdout as unknown as Writable<Buffer>)
    // })
    // stream.pipe(process.stdout as unknown as Writable<Buffer>)
    // return stream
  }
}
