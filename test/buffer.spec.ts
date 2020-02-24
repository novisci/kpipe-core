import { Reader } from '../src/reader'
import { Writer } from '../src/writer'
import { FileTemper } from './temper'

const fs = require('fs')
const rBuf = Reader({ type: 'buffer' })
const wBuf = Writer({ type: 'buffer' })
const ppipe = require('util').promisify(require('stream').pipeline)

const fileTemper = FileTemper()
afterEach(() => fileTemper.flush())

const testfile = './tests/data/stream.json'
const testData = fs.readFileSync(testfile)

test('buffer reader throws when no buffer supplied', () => {
  expect(() => {
    rBuf()
  }).toThrow()
})

test('buffer reader writes to file', async () => {
  const tmp = fileTemper.get()
  await ppipe(
    rBuf(testData),
    fs.createWriteStream(tmp)
  )
  expect(Buffer.compare(
    fs.readFileSync(tmp),
    testData
  )).toBe(0)
})

test('buffer writer reads from file', async () => {
  const dst = wBuf()
  await ppipe(
    fs.createReadStream(testfile),
    dst
  )
  expect(Buffer.compare(
    dst.get(),
    testData
  )).toBe(0)
})

test('buffer streams verbatim data', async () => {
  const dst = wBuf()
  await ppipe(
    rBuf(testData),
    dst
  )
  expect(Buffer.compare(
    dst.get(),
    testData
  )).toBe(0)
})
