const { PassThrough } = require('stream')

module.exports = function (options) {
  return () => {
    const stream = new PassThrough()
    stream.on('finish', () => {
      stream.unpipe(process.stdout)
    })
    stream.pipe(process.stdout)
    return stream
  }
}
