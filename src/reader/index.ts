import { ReadableStreamGenerator } from '../backend'
import { bkFs } from './fs'
import { bkS3 } from './s3_chunked'
import { bkStdio } from './stdio'
import { bkKafka } from './kafka'
import { bkBuffer } from './buffer'
import { bkRandom } from './random'

const readerBackends = ['fs', 's3', 'stdio', 'kafka', 'buffer', 'random'] as const
export type ReaderBackendType = typeof readerBackends[number]
export type ReaderBackendArgs = { type: ReaderBackendType, [key: string]: any}
export function isReaderBackend (s: string): s is ReaderBackendType {
  if ((readerBackends as readonly string[]).includes(s)) {
    return true
  }
  return false
}

export function Reader ({ type, ...options }: ReaderBackendArgs = { type: 'buffer' }): ReadableStreamGenerator<Buffer | string> {
  if (!type) {
    throw new Error('No reader backend specified in options.type')
  }

  // Backend readers return a function which creates new readable streams
  //  given a path
  let backend: ReadableStreamGenerator<Buffer | string>

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
