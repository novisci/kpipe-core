import { PassThrough } from 'stream'

export default function (options) {
  return () => {
    const stream = new PassThrough()
    stream.on('finish', () => {
      stream.unpipe(process.stdout)
    })
    stream.pipe(process.stdout)
    return stream
  }
}
