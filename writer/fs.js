const fs = require('fs')
const path = require('path')

module.exports = function (options) {
  const prefix = options.prefix || ''

  return (fn) => {
    const p = path.join(prefix, fn)

    console.info(`WRITE FS Path: ${p}`)
    return fs.createWriteStream(p)
  }
}
