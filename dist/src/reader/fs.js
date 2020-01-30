"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
module.exports = function (options) {
    const prefix = options.prefix || '';
    return (fn) => {
        const p = path.join(prefix, fn);
        console.info(`READ FS Path: ${p}`);
        const stream = fs.createReadStream(p);
        fs.stat(p, { bigint: true }, (err, stats) => {
            if (err) {
                return stream.emit('error', err);
            }
            stream.emit('notify', {
                type: 'readsize',
                size: stats.size
            });
        });
        return require('../stream-tracker')(stream);
    };
};
//# sourceMappingURL=fs.js.map