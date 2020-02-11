import * as fs from 'fs'
import * as path from 'path'
import { StreamGenerator } from '../backend'
import { Writable } from 'tstream'

type Opts = {
  prefix?: string
}

export default function (options: Opts = {}): StreamGenerator<Writable<Buffer>> {
  const prefix = options.prefix || ''

  return (fn: string): Writable<Buffer> => {
    const p = path.join(prefix, fn)

    console.info(`WRITE FS Path: ${p}`)
    return fs.createWriteStream(p) as Writable<Buffer>
  }
}
