"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
const path = __importStar(require("path"));
const stream_tracker_1 = require("../stream-tracker");
function default_1(options = {}) {
    if (!options.bucket || !options.region) {
        throw new Error('S3 reader requires options.bucket and options.region');
    }
    const s3 = new AWS.S3({
        apiVersion: '2017-08-08',
        region: options.region
    });
    const bucket = options.bucket;
    const prefix = options.prefix || '';
    return (key) => {
        const params = {
            Bucket: bucket,
            Key: path.join(prefix, key)
        };
        console.info(`READ S3 URL: s3://${params.Bucket}/${params.Key}`);
        const request = s3.getObject(params);
        const stream = request.createReadStream();
        request.on('httpHeaders', (status, headers) => {
            if (headers['content-length']) {
                stream.emit('notify', {
                    type: 'readsize',
                    size: BigInt(headers['content-length'])
                });
            }
        });
        return stream_tracker_1.StreamTracker(stream);
    };
}
exports.default = default_1;
//# sourceMappingURL=s3.js.map