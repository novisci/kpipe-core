import { Readable } from 'tstream'
import { StreamGenerator } from '../backend'

type ReaderBackendType = 'fs'|'s3'|'stdio'|'kafka'|'buffer'|'random'
type ReaderBackendArgs = { type: ReaderBackendType, [key: string]: any}

export default function ({ type, ...options }: ReaderBackendArgs = { type: 'buffer' }): StreamGenerator<Readable<Buffer | string>> {
  if (!type) {
    throw new Error('No reader backend specified in options.type')
  }

  // Backend readers return a function which creates new readable streams
  //  given a path
  let backend: StreamGenerator<Readable<Buffer | string>>

  switch (type) {
    case 'fs': backend = require('./fs')(options); break
    case 's3': backend = require('./s3')(options); break
    case 'stdio': backend = require('./stdio')(options); break
    case 'kafka': backend = require('./kafka')(options); break
    case 'buffer': backend = require('./buffer')(options); break
    case 'random': backend = require('./random')(options); break
    default: throw new Error(`Unknown reader type "${type}`)
  }

  return backend
}
