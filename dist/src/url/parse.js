"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/***
 * parse a kpipe storage url and return reader/writer parameters
 *
 * eg.
 *
 *  s3://bucket-name/pre/fix/object
 *
 *  fs://relative/path/from/cwd
 *
 *  fs:///absolute/path/to/file
 *
 *  stdio://
 *
 *  kafka://
 */
const reader_1 = require("../reader");
function safeMatch(url, regex, na = null) {
    const m = url.match(regex);
    if (!m) {
        return na;
    }
    return m[1];
}
const first = (arr) => arr[0];
const last = (arr) => arr[arr.length - 1];
const protocol = (url) => {
    const proto = safeMatch(url, /^([^:]+):\/\//);
    if (!reader_1.isReaderBackend(proto)) {
        throw Error(`Invalid reader protocol in parse url`);
    }
    return proto;
};
const path = (url) => safeMatch(url, /^[^:]+:\/\/(.*)$/);
const pathcomps = (url) => (path(url) || '').split('/');
const prefixes = (url) => pathcomps(url).slice(0, -1);
const extension = (url) => safeMatch(url, /\.([^/.]+)$/);
const isAbsolute = (url) => first(pathcomps(url)) === '';
const isDir = (url) => last(pathcomps(url)) === '';
const file = (url) => last(pathcomps(url)) || '';
function parse(url) {
    return {
        protocol: protocol(url),
        path: pathcomps(url),
        prefixes: prefixes(url),
        file: file(url),
        extension: extension(url),
        isAbsolute: isAbsolute(url),
        isDir: isDir(url)
    };
}
exports.parse = parse;
//# sourceMappingURL=parse.js.map