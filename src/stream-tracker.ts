import { Readable } from './tstream'

/***
 * Small utility to track a (non-object) stream's data event and report
 *  'notify' events to track progress
 */
export function StreamTracker<T extends Buffer | string> (stream: Readable<T>): Readable<T> {
  const EVERY = BigInt(10 * 1024)
  let count = BigInt(0)
  let last = BigInt(0)
  stream.on('data', (chunk) => {
    count += BigInt(chunk.length)
    if (count - last > EVERY) {
      stream.emit('notify', {
        type: 'readprogress',
        size: BigInt(count)
      })
      last = last + EVERY
    }
  })

  stream.on('end', () => {
    if (count > last) {
      stream.emit('notify', {
        type: 'readcomplete',
        size: BigInt(count)
      })
    }
  })

  return stream
}
