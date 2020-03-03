import { FileTemper } from './temper'
import * as fs from 'fs'

const fileTemper = FileTemper()

const ppipe = require('util').promisify(require('stream').pipeline)

afterEach(() => fileTemper.flush())

test('fs -> fs copy', async () => {
  const filename = './test/data/stream.json'
  const copyfile = fileTemper.get()
  await ppipe(
    require('..').Reader({ type: 'fs' })(filename),
    require('..').Writer({ type: 'fs' })(copyfile)
  )
  expect(Buffer.compare(
    fs.readFileSync(filename),
    fs.readFileSync(copyfile)
  )).toBe(0)
})
