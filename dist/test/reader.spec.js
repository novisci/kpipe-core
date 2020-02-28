"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("../src/reader");
// const streamTypes = ['fs', 's3', 'kafka', 'stdio']
const ppipe = require('util').promisify(require('stream').pipeline);
describe.each([
    ['fs', {}, ['./tests/data/stream.json']],
    ['s3', { region: 'us-east-1', bucket: 'novisci-public' }, ['tests/stream.json']]
    // ['kafka', { groupid: 'freddo' }, [ 'topic' ]],
    // ['stdio', {}, []]
])('%s reader', (type, options, args) => {
    const streamer = reader_1.Reader(Object.assign({ type: type }, options));
    test(`${type} constructor returns function`, () => {
        expect(typeof streamer).toBe('function');
    });
    test(`${type} generator returns stream`, async () => {
        const stream = streamer(...args);
        expect(stream instanceof require('stream').Readable).toBeTruthy();
        await ppipe(stream, require('..').Writer({ type: 'null' })());
    });
});
//# sourceMappingURL=reader.spec.js.map