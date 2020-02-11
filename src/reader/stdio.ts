import { PassThrough } from 'tstream'
import { Writable } from 'stream'

export default function () {
  return (): PassThrough<Buffer> => {
    const stream = new PassThrough<Buffer>({
      // autoClose: true
    })
    stream.on('end', () => {
      process.stdin.unpipe(stream as Writable)
    })
    process.stdin.pipe(stream as Writable)
    return stream
  }
}
