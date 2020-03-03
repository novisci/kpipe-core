import { Writable, StreamCallback } from '../tstream'
import { StreamGenerator } from '../backend'

export function bkNull (options?: {}): StreamGenerator<Writable<any>> {
  return (): Writable<any> => {
    const stream = new Writable<any>({
      write: (chunk: any, enc: string, cb: StreamCallback): void => {
        cb()
      }
    })

    return stream
  }
}
