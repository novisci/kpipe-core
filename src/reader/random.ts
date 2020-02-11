import { StreamGenerator } from '../backend'
import { Readable } from 'tstream'
import { StreamTracker } from '../stream-tracker'

function randIdx (max: number): number {
  max = Math.floor(max)
  return Math.floor(Math.random() * (max))
}

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function randString (len: number): string {
  let s = ''
  while (len--) {
    const r = randIdx(chars.length)
    s = s.concat(chars.substring(r, r + 1))
  }
  return s
}

function randValue (type: string): number|string {
  switch (type) {
    case 'string': return randString(16 + randIdx(16))
    case 'integer': return randIdx(1000000)
    case 'number': return Math.random() * 1000
    default: return 'NaN'
  }
}

type Opts = {
  width?: number
}

export default function (options: Opts = {}): StreamGenerator<Readable<string>> {
  const width = options.width || 10
  const cols = (new Array(width)).fill(null).map(() => {
    return ['string', 'integer', 'number'][randIdx(3)]
  })

  function randRow (): (string|number)[] {
    return cols.map((c) => randValue(c))
  }

  return (length): Readable<string> => {
    length = typeof length === 'undefined' ? 1000 : length

    let nRows = 0

    console.info(`READ RANDOM ${width}x${length}`)

    const stream = new Readable<string>({
      read: (count): void => {
        while (count--) {
          nRows++
          const row = randRow()
          if (nRows < length && !stream.push(JSON.stringify(row) + '\n')) {
            break
          }
        }
        if (nRows >= length) {
          stream.push(null)
        }
      }
    })

    return StreamTracker(stream)
  }
}
