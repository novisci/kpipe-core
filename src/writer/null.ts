const { Writable } = require('stream')

module.exports = function (options) {
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
