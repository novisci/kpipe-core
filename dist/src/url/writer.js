"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/***
 * return a writer by parsing a supplied URL
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
const writer_1 = require("../writer");
function writerUrl(url, { ...writerOpts } = {}) {
    const purl = parse_1.parse(url);
    const type = purl.protocol;
    if (!type || typeof type !== 'string' || !['stdio', 'fs', 's3', 'kafka'].includes(type)) {
        throw Error(`Invalid url type "${type}" from "${url}"`);
    }
    let writer;
    let streamArgs = () => [];
    switch (type) {
        case 'stdio':
            writer = writer_1.Writer({ type: 'stdio', ...writerOpts });
            streamArgs = () => [];
            break;
        case 'fs':
            writer = writer_1.Writer({ type: 'fs', ...writerOpts });
            streamArgs = () => [purl.path.join('/')];
            break;
        case 's3':
            writer = writer_1.Writer({
                type: 's3',
                region: process.env.KPIPE_S3REGION || 'us-east-1',
                bucket: purl.prefixes[0],
                prefix: purl.prefixes.slice(1).join('/'),
                ...writerOpts
            });
            streamArgs = () => [purl.file];
            break;
        case 'kafka':
            writer = writer_1.Writer({
                type: 'kafka',
                ...writerOpts
            });
            const opts = [purl.path[0]];
            if (purl.path[1]) {
                opts.push({
                    partition: parseInt(purl.path[1], 10)
                });
            }
            streamArgs = () => opts;
            break;
        default:
            throw Error(`Unsupported backend type in url/writer`);
    }
    return [writer, streamArgs];
}
exports.writerUrl = writerUrl;
//# sourceMappingURL=writer.js.map