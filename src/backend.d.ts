import { Stream } from 'stream'

export type StreamGenerator<T extends Stream> = (...args: any[]) => T
export type Backend<T extends Stream> = ({...any}) => Generator<T>

