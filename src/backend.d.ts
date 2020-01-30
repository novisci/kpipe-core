import { Stream } from 'stream'

export type StreamCb = (err?: Error) => void

export type StreamGenerator<T extends Stream> = (...args: any[]) => T
export type Backend<T extends Stream> = ({...any}) => Generator<T>

