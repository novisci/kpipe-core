import { Writable } from 'tstream'
import { StreamGenerator } from '../backend'

export default function (): StreamGenerator<Writable<any>> {
  return (): Writable<any> => {
    const stream = new Writable<any>({
      write: (chunk, enc, cb): void => {
        cb()
      }
    })

    return stream
  }
}
