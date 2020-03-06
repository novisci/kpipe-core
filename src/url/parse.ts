/***
 * parse a kpipe storage url and return reader/writer parameters
 *
 * eg.
 *
 *  s3://bucket-name/pre/fix/object
 *
 *  fs://relative/path/from/cwd
 *
 *  fs:///absolute/path/to/file
 *
 *  stdio://
 *
 *  kafka://
 */
import { ReaderBackendType, isReaderBackend } from '../reader'

interface ParsedUrl {
  readonly protocol: ReaderBackendType
  readonly path: string[]
  readonly prefixes: string[]
  readonly file: string
  readonly extension: string
  readonly isAbsolute: boolean
  readonly isDir: boolean
}

function safeMatch (url: string, regex: RegExp, na: any = null): string | typeof na {
  const m = url.match(regex)
  if (!m) {
    return na
  }
  return m[1]
}

const first = (arr: string[]): string => arr[0]
const last = (arr: string[]): string => arr[arr.length - 1]

const protocol = (url: string): ReaderBackendType => {
  const proto = safeMatch(url, /^([^:]+):\/\//)
  if (!isReaderBackend(proto)) {
    throw Error(`Invalid reader protocol in parse url`)
  }
  return proto
}

const path = (url: string): string => safeMatch(url, /^[^:]+:\/\/(.*)$/)
const pathcomps = (url: string): string[] => (path(url) || '').split('/')
const prefixes = (url: string): string[] => pathcomps(url).slice(0, -1)
const extension = (url: string): string => safeMatch(url, /\.([^/.]+)$/)
const isAbsolute = (url: string): boolean => first(pathcomps(url)) === ''
const isDir = (url: string): boolean => last(pathcomps(url)) === ''
const file = (url: string): string => last(pathcomps(url)) || ''

export function parse (url: string): ParsedUrl {
  return {
    protocol: protocol(url),
    path: pathcomps(url),
    prefixes: prefixes(url),
    file: file(url),
    extension: extension(url),
    isAbsolute: isAbsolute(url),
    isDir: isDir(url)
  }
}
