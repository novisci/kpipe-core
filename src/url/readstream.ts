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
 *  kafka://
 */
import { Readable } from '../tstream'
import { readerUrl } from './reader'

module.exports = function (url: string, { ...readerOpts } = {}): Readable<Buffer | string> {
  const [reader, streamArgs] = readerUrl(url, readerOpts)

  const stream = reader(...streamArgs())
  return stream as Readable<Buffer | string>
}
