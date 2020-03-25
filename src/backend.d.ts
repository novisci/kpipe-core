import { Stream, Writable, Readable } from 'node-typestream'

export type KafkaStreamArgs = [string, {partition?: number, offset?: number}?]
export type S3StreamArgs = [string]
export type FsStreamArgs = [string]
export type BufferStreamArgs = [Buffer]
export type StdioStreamArgs = []

export type StreamArgs = KafkaStreamArgs | S3StreamArgs | FsStreamArgs | StdioStreamArgs | BufferStreamArgs

export type StreamCb = (err?: Error) => void

export type StreamGenerator<T> = ReadableStreamGenerator<T> | WritableStreamGenerator<T>
export type ReadableStreamGenerator<T> = (...args: any[]) => Readable<T>
export type WritableStreamGenerator<T> = (...args: any[]) => Writable<T>

export type Backend<T> = ({...any}) => Generator<T>

