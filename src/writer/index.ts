import { Writable } from '../tstream'
import { StreamGenerator } from '../backend'
import { bkFs } from './fs'
import { bkS3 } from './s3'
import { bkStdio } from './stdio'
import { bkKafka } from './kafka'
import { bkBuffer } from './buffer'
import { bkNull } from './null'

const writerBackends = ['fs', 's3', 'stdio', 'kafka', 'buffer', 'null'] as const
export type WriterBackendType = typeof writerBackends[number]
export type WriterBackendArgs = { type: WriterBackendType, [key: string]: any}
export function isWriterBackend (s: string): s is WriterBackendType {
  if ((writerBackends as readonly string[]).includes(s)) {
    return true
  }
  return false
}

export function Writer ({ type, ...options }: WriterBackendArgs = { type: 'buffer' }): StreamGenerator<Buffer | string> {
  if (!type) {
    throw new Error('No writer backend specified in options.type')
  }

  // Backend writers return a function which creates new writable streams
  //  given a path
  let backend: StreamGenerator<Buffer | string>

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
