"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const temper_1 = require("./temper");
const fs = require('fs');
const fileTemper = temper_1.FileTemper();
const ppipe = require('util').promisify(require('stream').pipeline);
afterEach(() => fileTemper.flush());
test('fs -> fs copy', async () => {
    const filename = './tests/data/stream.json';
    const copyfile = fileTemper.get();
    await ppipe(require('..').Reader({ type: 'fs' })(filename), require('..').Writer({ type: 'fs' })(copyfile));
    expect(Buffer.compare(fs.readFileSync(filename), fs.readFileSync(copyfile))).toBe(0);
});
//# sourceMappingURL=fs.spec.js.map