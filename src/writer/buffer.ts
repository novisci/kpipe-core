import { Writable, StreamCallback } from '../tstream'
import { StreamGenerator } from '../backend'

export function bkBuffer (options?: {}): StreamGenerator<Writable<Buffer>> {
  return (src?: string): Writable<Buffer> => {
    src = src || ''
    if (!Buffer.isBuffer(src) && typeof src !== 'string') {
      throw Error('supplied argument must be a buffer or string')
    }

    let _buffer = Buffer.from(src)

    const stream = new Writable<Buffer>({
      objectMode: false,
      write: (chunk: Buffer, enc: string, cb: StreamCallback): void => {
        _buffer = Buffer.concat([_buffer, Buffer.from(chunk)])
        cb()
      }
    })

    stream.on('finish', () => {
      stream.emit('buffer', _buffer)
    })

    return stream
  }
}
