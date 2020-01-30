import * as fs from 'fs'
import * as path from 'path'

export default function (options) {
  const prefix = options.prefix || ''

  return (fn: string) => {
    const p = path.join(prefix, fn)

    console.info(`WRITE FS Path: ${p}`)
    return fs.createWriteStream(p)
  }
}
