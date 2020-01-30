import { Readable } from 'stream'
import { StreamGenerator } from '../backend'

export default function (): StreamGenerator<Readable> {
  return (buffer: Buffer): Readable => {
    if (!Buffer.isBuffer(buffer)) {
      throw Error('supplied argument must be a buffer')
    }

    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
  }
}
