import { Stream } from './tstream'

export type StreamCb = (err?: Error) => void

export type StreamGenerator<T> = (...args: any[]) => Stream<T>
export type Backend<T> = ({...any}) => Generator<T>
