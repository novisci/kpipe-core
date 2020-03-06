/***
 * return a reader by parsing a supplied URL
 *
 * eg.
 *
 *  s3://bucket-name/path/to/object
 *
 *  fs://relative/path/from/cwd
 *
 *  fs:///absolute/path/to/file
 *
 *  stdio://
 *
 *  kafka://topic/partition/offset
 */
import { parse } from './parse'
import { StreamGenerator, StreamArgs, KafkaStreamArgs, S3StreamArgs, StdioStreamArgs, FsStreamArgs } from '../backend'
import { Reader, ReaderBackendType } from '../reader'

export function readerUrl (url: string, { ...readerOpts } = {}): [StreamGenerator<Buffer | string>, () => StreamArgs] {
  const purl = parse(url)
  const type = purl.protocol as ReaderBackendType

  if (!type || typeof type !== 'string' || !['stdio', 'fs', 's3', 'kafka'].includes(type)) {
    throw Error(`Invalid url type "${type}" from "${url}"`)
  }

  let reader
  let streamArgs: () => StreamArgs = () => []

  switch (type) {
    case 'stdio':
      reader = Reader({ type: 'stdio', ...readerOpts })
      streamArgs = (): StdioStreamArgs => []
      break
    case 'fs':
      reader = Reader({ type: 'fs', ...readerOpts })
      streamArgs = (): FsStreamArgs => [purl.path.join('/')]
      break
    case 's3':
      reader = Reader({
        type: 's3',
        region: process.env.KPIPE_S3REGION || 'us-east-1',
        bucket: purl.prefixes[0],
        prefix: purl.prefixes.slice(1).join('/'),
        ...readerOpts
      })
      if (!purl.file) {
        throw Error('No file found in url')
      }
      streamArgs = (): S3StreamArgs => [purl.file]
      break
    case 'kafka':
      reader = Reader({
        type: 'kafka',
        ...readerOpts
      })
      const opts: KafkaStreamArgs = [purl.path[0]]
      if (purl.path[1]) {
        opts.push({
          partition: parseInt(purl.path[1], 10),
          offset: typeof purl.path[2] !== 'undefined' ? parseInt(purl.path[2], 10) : 0
        })
      }
      streamArgs = (): KafkaStreamArgs => opts
      break
    default:
      throw Error(`Unsupported backend type in url/reader`)
  }

  return [reader, streamArgs]
}
