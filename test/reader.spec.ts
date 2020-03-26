import { Reader, ReaderBackendType } from '../src/reader'
import { Readable } from 'node-typestream'
import * as NodeStream from 'stream'
import * as util from 'util'

// const streamTypes = ['fs', 's3', 'kafka', 'stdio']

const ppipe = require('util').promisify(require('stream').pipeline)

// type TestArgs = [ReaderBackendType, {}, string[]]

describe.each([
  ['fs', {}, [ './test/data/stream.json' ]],
  ['s3', { region: 'us-east-1', bucket: 'novisci-public' }, [ 'tests/stream.json' ]]
  // ['kafka', { groupid: 'freddo' }, [ 'topic' ]],
  // ['stdio', {}, []]
])('%s reader', (type, options, args) => {
  const streamer = Reader(Object.assign({ type: type as ReaderBackendType }, options))

  test(`${type} constructor returns function`, () => {
    expect(typeof streamer).toBe('function')
  })

  test(`${type} generator returns stream`, async () => {
    const stream = streamer(...args)
    expect(stream instanceof Readable).toBeTruthy()
    await ppipe(
      stream,
      require('..').Writer({ type: 'null' })()
    )
  })
})
