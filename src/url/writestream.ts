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
 *  kafka://
 */
import { Writable } from 'node-typestream'
import { writerUrl } from './writer'

export function writeStreamUrl (url: string, { ...writerOpts } = {}): Writable<Buffer | string> {
  const [writer, streamArgs] = writerUrl(url, writerOpts)

  const stream = writer(...streamArgs()) as Writable<Buffer | string>
  return stream
}
