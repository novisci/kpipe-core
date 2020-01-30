"use strict";
const fs = require('fs');
const fileTemper = require('./temper').FileTemper();
const ppipe = require('util').promisify(require('stream').pipeline);
afterEach(() => fileTemper.flush());
test('fs -> fs copy', async () => {
    const filename = './tests/data/stream.json';
    const copyfile = fileTemper.get();
    await ppipe(require('..').Reader({ type: 'fs' })(filename), require('..').Writer({ type: 'fs' })(copyfile));
    expect(Buffer.compare(fs.readFileSync(filename), fs.readFileSync(copyfile))).toBe(0);
});
//# sourceMappingURL=fs.spec.js.map