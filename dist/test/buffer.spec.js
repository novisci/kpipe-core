"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("../src/reader");
const writer_1 = require("../src/writer");
const temper_1 = require("./temper");
const fs = require('fs');
const rBuf = reader_1.Reader({ type: 'buffer' });
const wBuf = writer_1.Writer({ type: 'buffer' });
const ppipe = require('util').promisify(require('stream').pipeline);
const fileTemper = temper_1.FileTemper();
afterEach(() => fileTemper.flush());
const testfile = './tests/data/stream.json';
const testData = fs.readFileSync(testfile);
test('buffer reader throws when no buffer supplied', () => {
    expect(() => {
        rBuf();
    }).toThrow();
});
test('buffer reader writes to file', async () => {
    const tmp = fileTemper.get();
    await ppipe(rBuf(testData), fs.createWriteStream(tmp));
    expect(Buffer.compare(fs.readFileSync(tmp), testData)).toBe(0);
});
test('buffer writer reads from file', async () => {
    const dst = wBuf();
    let buff = Buffer.from('');
    dst.on('buffer', (b) => { buff = b; });
    await ppipe(fs.createReadStream(testfile), dst);
    expect(Buffer.compare(buff, testData)).toBe(0);
});
test('buffer streams verbatim data', async () => {
    const dst = wBuf();
    let buff = Buffer.from('');
    dst.on('buffer', (b) => { buff = b; });
    await ppipe(rBuf(testData), dst);
    expect(Buffer.compare(buff, testData)).toBe(0);
});
//# sourceMappingURL=buffer.spec.js.map