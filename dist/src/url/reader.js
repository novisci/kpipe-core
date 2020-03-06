"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/***
 * return a reader by parsing a supplied URL
 *
 * eg.
 *
 *  s3://bucket-name/path/to/object
 *
 *  fs://relative/path/from/cwd
 *
 *  fs:///absolute/path/to/file
 *
 *  stdio://
 *
 *  kafka://topic/partition/offset
 */
const parse_1 = require("./parse");
const reader_1 = require("../reader");
function readerUrl(url, { ...readerOpts } = {}) {
    const purl = parse_1.parse(url);
    const type = purl.protocol;
    if (!type || typeof type !== 'string' || !['stdio', 'fs', 's3', 'kafka'].includes(type)) {
        throw Error(`Invalid url type "${type}" from "${url}"`);
    }
    let reader;
    let streamArgs = () => [];
    switch (type) {
        case 'stdio':
            reader = reader_1.Reader({ type: 'stdio', ...readerOpts });
            streamArgs = () => [];
            break;
        case 'fs':
            reader = reader_1.Reader({ type: 'fs', ...readerOpts });
            streamArgs = () => [purl.path.join('/')];
            break;
        case 's3':
            reader = reader_1.Reader({
                type: 's3',
                region: process.env.KPIPE_S3REGION || 'us-east-1',
                bucket: purl.prefixes[0],
                prefix: purl.prefixes.slice(1).join('/'),
                ...readerOpts
            });
            if (!purl.file) {
                throw Error('No file found in url');
            }
            streamArgs = () => [purl.file];
            break;
        case 'kafka':
            reader = reader_1.Reader({
                type: 'kafka',
                ...readerOpts
            });
            const opts = [purl.path[0]];
            if (purl.path[1]) {
                opts.push({
                    partition: parseInt(purl.path[1], 10),
                    offset: typeof purl.path[2] !== 'undefined' ? parseInt(purl.path[2], 10) : 0
                });
            }
            streamArgs = () => opts;
            break;
        default:
            throw Error(`Unsupported backend type in url/reader`);
    }
    return [reader, streamArgs];
}
exports.readerUrl = readerUrl;
//# sourceMappingURL=reader.js.map