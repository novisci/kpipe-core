import * as fs from 'fs'
import * as path from 'path'
import { WritableStreamGenerator } from '../backend'
import { Writable } from 'node-typestream'

type Opts = {
  prefix?: string
}

export function bkFs (options: Opts = {}): WritableStreamGenerator<Buffer> {
  const prefix = options.prefix || ''

  return (fn: string): Writable<Buffer> => {
    const p = path.join(prefix, fn)

    console.info(`WRITE FS Path: ${p}`)
    // return fs.createWriteStream(p) as unknown as Writable<Buffer>
    return new Writable<Buffer>({
      stream: fs.createWriteStream(p)
    })
  }
}
