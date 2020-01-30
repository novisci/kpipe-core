import { Writable } from 'stream'

export default function (options) {
  options = options || {}

  return (src) => {
    src = src || ''
    if (!Buffer.isBuffer(src) && typeof src !== 'string') {
      throw Error('supplied argument must be a buffer or string')
    }

    let _buffer = Buffer.from(src)

    const stream = new Writable({
      objectMode: false,
      write: (chunk, enc, cb) => {
        _buffer = Buffer.concat([_buffer, Buffer.from(chunk, enc)])
        cb()
      }
    })

    stream.get = () => _buffer

    return stream
  }
}
