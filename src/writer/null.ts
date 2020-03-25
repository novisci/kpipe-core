import { Writable } from 'node-typestream'
import { WritableStreamGenerator } from '../backend'

export function bkNull (options?: {}): WritableStreamGenerator<any> {
  return (): Writable<any> => {
    const stream = new Writable<any>({
      write: (chunk: any, enc: string, cb: (error?: Error | null) => void): void => {
        cb()
      }
    })

    return stream
  }
}
