"use strict";
module.exports = function ({ type, ...options } = {}) {
    if (!type) {
        throw new Error('No writer backend specified in options.type');
    }
    // Backend writers return a function which creates new writable streams
    //  given a path
    let backend = null;
    switch (type) {
        case 'fs':
            backend = require('./fs')(options);
            break;
        case 's3':
            backend = require('./s3')(options);
            break;
        case 'stdio':
            backend = require('./stdio')(options);
            break;
        case 'kafka':
            backend = require('./kafka')(options);
            break;
        case 'buffer':
            backend = require('./buffer')(options);
            break;
        case 'null':
            backend = require('./null')(options);
            break;
        default: throw new Error(`Unknown writer type "${type}`);
    }
    return (...args) => backend(...args);
};
//# sourceMappingURL=index.js.map