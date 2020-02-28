import { PassThrough, Writable } from 'tstream'

export default function () {
  return (): PassThrough<Buffer> => {
    const stream = new PassThrough<Buffer>({
      // autoClose: true
    })
    stream.on('end', () => {
      process.stdin.unpipe(stream as Writable<Buffer>)
    })
    process.stdin.pipe(stream as Writable<Buffer>)
    return stream
  }
}
