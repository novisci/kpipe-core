import * as fs from 'fs'
import * as path from 'path'
import { StreamGenerator } from '../backend'
import { Readable } from '../tstream'
import { StreamTracker } from '../stream-tracker'

type Opts = {
  prefix?: string
}

export function bkFs (options: Opts = {}): StreamGenerator<Readable<Buffer>> {
  const prefix = options.prefix || ''

  return (fn: string): Readable<Buffer> => {
    const p = path.join(prefix, fn)

    console.info(`READ FS Path: ${p}`)
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

    return StreamTracker(stream as Readable<Buffer>)
  }
}
