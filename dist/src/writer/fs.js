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
function default_1(options = {}) {
    const prefix = options.prefix || '';
    return (fn) => {
        const p = path.join(prefix, fn);
        console.info(`WRITE FS Path: ${p}`);
        return fs.createWriteStream(p);
    };
}
exports.default = default_1;
//# sourceMappingURL=fs.js.map