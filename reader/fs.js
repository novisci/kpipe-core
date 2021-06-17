const fs = require('fs')
const path = require('path')

module.exports = function (options) {
  const prefix = options.prefix || ''

  return (fn) => {
    const p = path.join(prefix, fn)

    !options.quiet && console.info(`READ FS Path: ${p}`)
    const stream = fs.createReadStream(p)

    fs.stat(p, { bigint: true }, (err, stats) => {
      if (err) {
        return stream.emit('error', err)
      }
      stream.emit('notify', {
        type: 'readsize',
        size: stats.size
      })
    })

    return require('../stream-tracker')(stream)
  }
}
