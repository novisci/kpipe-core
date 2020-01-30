import * as fs from 'fs'
import * as path from 'path'
import { StreamGenerator } from '../backend'
import { Writable } from 'stream'

type Opts = {
  prefix?: string
}

export default function (options: Opts = {}): StreamGenerator<Writable> {
  const prefix = options.prefix || ''

  return (fn: string): Writable => {
    const p = path.join(prefix, fn)

    console.info(`WRITE FS Path: ${p}`)
    return fs.createWriteStream(p)
  }
}
