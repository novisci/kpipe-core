import { PassThrough } from '../tstream'

export function bkStdio (options?: {}) {
  return (): PassThrough<Buffer> => {
    const stream = new PassThrough<Buffer>({
      // autoClose: true
    })
    stream.on('end', () => {
      process.stdin.unpipe(stream)
    })
    process.stdin.pipe(stream)
    return stream
  }
}
