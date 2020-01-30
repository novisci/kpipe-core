"use strict";
const Reader = require('..').Reader;
const streamTypes = ['fs', 's3', 'kafka', 'stdio'];
const ppipe = require('util').promisify(require('stream').pipeline);
describe.each([
    ['fs', {}, ['./tests/data/stream.json']],
    ['s3', { region: 'us-east-1', bucket: 'novisci-public' }, ['tests/stream.json']],
])('%s reader', (type, options, args) => {
    const streamer = Reader(Object.assign({ type }, options));
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