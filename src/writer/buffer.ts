import { Writable } from 'stream'
import { StreamGenerator } from '../backend'

declare module 'stream' {
  interface Writable {
    get?(): Buffer
  }
}

export default function (): StreamGenerator<Writable> {
  return (src?: string): Writable => {
    src = src || ''
    if (!Buffer.isBuffer(src) && typeof src !== 'string') {
      throw Error('supplied argument must be a buffer or string')
    }

    let _buffer = Buffer.from(src)

    const stream = new Writable({
      objectMode: false,
      write: (chunk, enc, cb): void => {
        _buffer = Buffer.concat([_buffer, Buffer.from(chunk)])
        cb()
      }
    })

    stream.get = (): Buffer => _buffer

    return stream
  }
}
