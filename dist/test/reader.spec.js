"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("../src/reader");
// import { Readable } from '../src/tstream'
const NodeStream = __importStar(require("stream"));
// const streamTypes = ['fs', 's3', 'kafka', 'stdio']
const ppipe = require('util').promisify(require('stream').pipeline);
// type TestArgs = [ReaderBackendType, {}, string[]]
describe.each([
    ['fs', {}, ['./test/data/stream.json']],
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
        expect(stream instanceof NodeStream.Readable).toBeTruthy();
        await ppipe(stream, require('..').Writer({ type: 'null' })());
    });
});
//# sourceMappingURL=reader.spec.js.map