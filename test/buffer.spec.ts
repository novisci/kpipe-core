import { Reader } from '../src/reader'
import { Writer } from '../src/writer'
import { Readable, Writable, pipeline } from 'node-typestream'
import { FileTemper } from './temper'

const fs = require('fs')

function rBuf (data?: Buffer): Readable<Buffer> {
  return Reader({
    type: 'buffer'
  })(data)
}

function wBuf (cb: (buffer: Buffer) => void): Writable<Buffer> {
  return Writer({
    type: 'buffer',
    cbBuffer: cb
  })()
}

// const ppipe = require('util').promisify(require('stream').pipeline)

const fileTemper = FileTemper()
afterEach(() => fileTemper.flush())

const testfile = './test/data/stream.json'
const testData = fs.readFileSync(testfile)

test('buffer reader throws when no buffer supplied', () => {
  expect(() => {
    rBuf()
  }).toThrow()
})

test('buffer reader writes to file', async () => {
  const tmp = fileTemper.get()
  await pipeline(
    rBuf(testData),
    new Writable<Buffer>({
      stream: fs.createWriteStream(tmp)
    })
  )
  expect(Buffer.compare(
    fs.readFileSync(tmp),
    testData
  )).toBe(0)
})

test('buffer writer reads from file', async () => {
  const dst = wBuf((b: Buffer) => {
    buff = b
  })
  let buff = Buffer.from('')
  // dst.on('buffer', (b: Buffer) => { buff = b })
  await pipeline(
    new Readable<Buffer>({
      stream: fs.createReadStream(testfile)
    }),
    dst
  )
  expect(Buffer.compare(
    buff,
    testData
  )).toBe(0)
})

test('buffer streams verbatim data', async () => {
  const dst = wBuf((b: Buffer) => {
    buff = b
  })
  let buff = Buffer.from('')
  // dst.on('buffer', (b: Buffer) => { buff = b })
  await pipeline(
    rBuf(testData),
    dst
  )
  expect(Buffer.compare(
    buff,
    testData
  )).toBe(0)
})
