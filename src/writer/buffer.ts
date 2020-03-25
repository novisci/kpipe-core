import { Writable } from 'node-typestream'
import { WritableStreamGenerator } from '../backend'

interface BufferWriterOpts {
  cbBuffer?: (buffer: Buffer) => void
}

export function bkBuffer (options: BufferWriterOpts): WritableStreamGenerator<Buffer> {
  return (src?: string): Writable<Buffer> => {
    src = src || ''
    if (!Buffer.isBuffer(src) && typeof src !== 'string') {
      throw Error('supplied argument must be a buffer or string')
    }

    let _buffer = Buffer.from(src)

    const stream = new Writable<Buffer>({
      objectMode: false,
      write: (chunk: Buffer, enc: string, cb: (error?: Error | null) => void): void => {
        _buffer = Buffer.concat([_buffer, Buffer.from(chunk)])
        cb()
      }
    })

    stream.on('finish', () => {
      if (options.cbBuffer) {
        options.cbBuffer(_buffer)
      }
    })

    return stream
  }
}
