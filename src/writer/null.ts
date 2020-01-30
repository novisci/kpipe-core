import { Writable } from 'stream'

export default function (options) {
  options = options || {}

  return () => {
    const stream = new Writable({
      write: (chunk, enc, cb) => {
        cb()
      }
    })

    return stream
  }
}
