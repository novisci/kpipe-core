import { Writable } from '../tstream'
import { StreamGenerator } from '../backend'
import { bkFs } from './fs'
import { bkS3 } from './s3'
import { bkStdio } from './stdio'
import { bkKafka } from './kafka'
import { bkBuffer } from './buffer'
import { bkNull } from './null'

type WriterBackendType = 'fs'|'s3'|'stdio'|'kafka'|'buffer'|'null'
type WriterBackendArgs = { type: WriterBackendType, [key: string]: any}

export function Writer ({ type, ...options }: WriterBackendArgs = { type: 'buffer' }): StreamGenerator<Writable<Buffer | string>> {
  if (!type) {
    throw new Error('No writer backend specified in options.type')
  }

  // Backend writers return a function which creates new writable streams
  //  given a path
  let backend: StreamGenerator<Writable<Buffer | string>>

  switch (type) {
    case 'fs': backend = bkFs(options); break
    case 's3': backend = bkS3(options); break
    case 'stdio': backend = bkStdio(options); break
    case 'kafka': backend = bkKafka(options); break
    case 'buffer': backend = bkBuffer(options); break
    case 'null': backend = bkNull(options); break
    default: throw new Error(`Unknown writer type "${type}`)
  }

  return backend
}
