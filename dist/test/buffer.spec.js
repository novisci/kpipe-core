"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("../src/reader");
const writer_1 = require("../src/writer");
const node_typestream_1 = require("node-typestream");
const temper_1 = require("./temper");
const fs = require('fs');
function rBuf(data) {
    return reader_1.Reader({
        type: 'buffer'
    })(data);
}
function wBuf(cb) {
    return writer_1.Writer({
        type: 'buffer',
        cbBuffer: cb
    })();
}
// const ppipe = require('util').promisify(require('stream').pipeline)
const fileTemper = temper_1.FileTemper();
afterEach(() => fileTemper.flush());
const testfile = './test/data/stream.json';
const testData = fs.readFileSync(testfile);
test('buffer reader throws when no buffer supplied', () => {
    expect(() => {
        rBuf();
    }).toThrow();
});
test('buffer reader writes to file', async () => {
    const tmp = fileTemper.get();
    await node_typestream_1.pipeline(rBuf(testData), new node_typestream_1.Writable({
        stream: fs.createWriteStream(tmp)
    }));
    expect(Buffer.compare(fs.readFileSync(tmp), testData)).toBe(0);
});
test('buffer writer reads from file', async () => {
    const dst = wBuf((b) => {
        buff = b;
    });
    let buff = Buffer.from('');
    // dst.on('buffer', (b: Buffer) => { buff = b })
    await node_typestream_1.pipeline(new node_typestream_1.Readable({
        stream: fs.createReadStream(testfile)
    }), dst);
    expect(Buffer.compare(buff, testData)).toBe(0);
});
test('buffer streams verbatim data', async () => {
    const dst = wBuf((b) => {
        buff = b;
    });
    let buff = Buffer.from('');
    // dst.on('buffer', (b: Buffer) => { buff = b })
    await node_typestream_1.pipeline(rBuf(testData), dst);
    expect(Buffer.compare(buff, testData)).toBe(0);
});
//# sourceMappingURL=buffer.spec.js.map