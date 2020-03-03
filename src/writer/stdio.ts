import { PassThrough, Writable } from '../tstream'
import { StreamGenerator } from '../backend'

export function bkStdio (options?: {}): StreamGenerator<Writable<Buffer>> {
  return (): Writable<Buffer> => {
    const stream = new PassThrough<Buffer>()
    stream.on('finish', () => {
      stream.unpipe(process.stdout)
    })
    stream.pipe(process.stdout)
    return stream
  }
}
