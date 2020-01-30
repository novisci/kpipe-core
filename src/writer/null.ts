import { Writable } from 'stream'
import { StreamGenerator } from '../backend'

export default function (): StreamGenerator<Writable> {
  return (): Writable => {
    const stream = new Writable({
      write: (chunk, enc, cb): void => {
        cb()
      }
    })

    return stream
  }
}
