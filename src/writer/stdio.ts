import { PassThrough, Writable } from 'stream'
import { StreamGenerator } from '../backend'

export default function (): StreamGenerator<Writable> {
  return (): Writable => {
    const stream = new PassThrough()
    stream.on('finish', () => {
      stream.unpipe(process.stdout)
    })
    stream.pipe(process.stdout)
    return stream
  }
}
