const { PassThrough } = require('stream')

module.exports = function (options) {
  return () => {
    const stream = new PassThrough({
      // autoClose: true
    })
    stream.on('end', () => {
      process.stdin.unpipe(stream)
    })
    process.stdin.pipe(stream)
    return stream
  }
}
