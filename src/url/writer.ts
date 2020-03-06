/***
 * return a writer by parsing a supplied URL
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
import { Writer, WriterBackendType } from '../writer'

export function writerUrl (url: string, { ...writerOpts } = {}): [StreamGenerator<Buffer | string>, () => StreamArgs] {
  const purl = parse(url)
  const type = purl.protocol as WriterBackendType

  if (!type || typeof type !== 'string' || !['stdio', 'fs', 's3', 'kafka'].includes(type)) {
    throw Error(`Invalid url type "${type}" from "${url}"`)
  }

  let writer
  let streamArgs: () => StreamArgs = () => []

  switch (type) {
    case 'stdio':
      writer = Writer({ type: 'stdio', ...writerOpts })
      streamArgs = (): StdioStreamArgs => []
      break
    case 'fs':
      writer = Writer({ type: 'fs', ...writerOpts })
      streamArgs = (): FsStreamArgs => [purl.path.join('/')]
      break
    case 's3':
      writer = Writer({
        type: 's3',
        region: process.env.KPIPE_S3REGION || 'us-east-1',
        bucket: purl.prefixes[0],
        prefix: purl.prefixes.slice(1).join('/'),
        ...writerOpts
      })
      streamArgs = (): S3StreamArgs => [purl.file as string]
      break
    case 'kafka':
      writer = Writer({
        type: 'kafka',
        ...writerOpts
      })
      const opts: KafkaStreamArgs = [purl.path[0]]
      if (purl.path[1]) {
        opts.push({
          partition: parseInt(purl.path[1], 10)
        })
      }
      streamArgs = (): KafkaStreamArgs => opts
      break
    default:
      throw Error(`Unsupported backend type in url/writer`)
  }

  return [writer, streamArgs]
}
