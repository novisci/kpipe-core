export interface NotifyData {
  type: string
  [key: string]: any
}

declare module 'node-typestream' {
  export interface Readable<O> {
    addListener(event: 'notify', listener: (data: NotifyData) => void): this
    emit(event: 'notify', data: NotifyData): boolean

    on(event: 'close', listener: () => void): this
    on(event: 'data', listener: (chunk: any) => void): this
    on(event: 'end', listener: () => void): this
    on(event: 'readable', listener: () => void): this
    on(event: 'error', listener: (err: Error) => void): this
    on(event: 'notify', listener: (data: NotifyData) => void): this
    on(event: string | symbol, listener: (...args: any[]) => void): this

    once(event: 'notify', listener: (data: NotifyData) => void): this
    prependListener(event: 'notify', listener: (data: NotifyData) => void): this
    prependOnceListener(event: 'notify', listener: (data: NotifyData) => void): this
    removeListener(event: 'notify', listener: (data: NotifyData) => void): this
  }
}
