const { Readable } = require('stream')

module.exports = function (options) {
  options = options || {}

  return (buffer) => {
    if (!Buffer.isBuffer(buffer)) {
      throw Error('supplied argument must be a buffer')
    }

    let stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
  }
}
