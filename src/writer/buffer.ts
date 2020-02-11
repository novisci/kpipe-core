import { Writable } from 'tstream'
import { StreamGenerator } from '../backend'

declare module 'tstream' {
  interface Writable<T> {
    get?(): Buffer
  }
}

export default function (): StreamGenerator<Writable<Buffer>> {
  return (src?: string): Writable<Buffer> => {
    src = src || ''
    if (!Buffer.isBuffer(src) && typeof src !== 'string') {
      throw Error('supplied argument must be a buffer or string')
    }

    let _buffer = Buffer.from(src)

    const stream = new Writable<Buffer>({
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
