import { Readable } from '../tstream'
import { StreamGenerator } from '../backend'
import { bkFs } from './fs'
import { bkS3 } from './s3'
import { bkStdio } from './stdio'
import { bkKafka } from './kafka'
import { bkBuffer } from './buffer'
import { bkRandom } from './random'

export type ReaderBackendType = 'fs'|'s3'|'stdio'|'kafka'|'buffer'|'random'
export type ReaderBackendArgs = { type: ReaderBackendType, [key: string]: any}

export function Reader ({ type, ...options }: ReaderBackendArgs = { type: 'buffer' }): StreamGenerator<Readable<Buffer | string>> {
  if (!type) {
    throw new Error('No reader backend specified in options.type')
  }

  // Backend readers return a function which creates new readable streams
  //  given a path
  let backend: StreamGenerator<Readable<Buffer | string>>

  switch (type) {
    case 'fs': backend = bkFs(options); break
    case 's3': backend = bkS3(options); break
    case 'stdio': backend = bkStdio(options); break
    case 'kafka': backend = bkKafka(options); break
    case 'buffer': backend = bkBuffer(options); break
    case 'random': backend = bkRandom(options); break
    default: throw new Error(`Unknown reader type "${type}`)
  }

  return backend
}
