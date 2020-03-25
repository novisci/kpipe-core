import { Readable } from 'node-typestream'
import { ReadableStreamGenerator } from '../backend'

export function bkBuffer (options?: {}): ReadableStreamGenerator<Buffer> {
  return (buffer: Buffer): Readable<Buffer> => {
    if (!Buffer.isBuffer(buffer)) {
      throw Error('supplied argument must be a buffer')
    }

    const stream = new Readable<Buffer>()
    stream.push(buffer)
    stream.push(null)
    return stream
  }
}
