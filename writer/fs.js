const fs = require('fs')
const path = require('path')

module.exports = function (options) {
  const prefix = options.prefix || ''

  return (fn) => {
    const p = path.join(prefix, fn)

    // Make sure the path exists
    fs.mkdirSync(path.dirname(p), { recursive: true })

    if (!options.quiet) {
      console.info(`WRITE FS Path: ${p}`)
    }
    
    return fs.createWriteStream(p)
  }
}
