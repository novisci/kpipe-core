import { Writable } from 'stream'
import { StreamGenerator } from '../backend'

type WriterBackendType = 'fs'|'s3'|'stdio'|'kafka'|'buffer'|'null'
type WriterBackendArgs = { type: WriterBackendType, [key: string]: any}

export default function ({ type, ...options }: WriterBackendArgs = { type: 'buffer' }): StreamGenerator<Writable> {
  if (!type) {
    throw new Error('No writer backend specified in options.type')
  }

  // Backend writers return a function which creates new writable streams
  //  given a path
  let backend: StreamGenerator<Writable>

  switch (type) {
    case 'fs': backend = require('./fs')(options); break
    case 's3': backend = require('./s3')(options); break
    case 'stdio': backend = require('./stdio')(options); break
    case 'kafka': backend = require('./kafka')(options); break
    case 'buffer': backend = require('./buffer')(options); break
    case 'null': backend = require('./null')(options); break
    default: throw new Error(`Unknown writer type "${type}`)
  }

  return backend
}
