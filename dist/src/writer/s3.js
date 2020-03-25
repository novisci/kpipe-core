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
const node_typestream_1 = require("node-typestream");
const path = __importStar(require("path"));
function bkS3(options = {}) {
    if (!options.bucket || !options.region) {
        throw new Error('S3 writer requires options.bucket and options.region');
    }
    const s3 = new AWS.S3({
        apiVersion: '2017-08-08',
        region: options.region
    });
    const bucket = options.bucket;
    const prefix = options.prefix || '';
    const keyid = options.key;
    const queueSize = options.queueSize || 4;
    const partSize = options.partSize || 5 * 1024 * 1024;
    return (fn) => {
        const s3stream = new node_typestream_1.PassThrough();
        const stream = new node_typestream_1.Writable({
            write: (chunk, enc, cb) => {
                s3stream.write(chunk, enc, cb);
            },
            final: (cb) => {
                // s3stream.end()
                const intvl = setInterval(() => {
                    if (completed) {
                        console.debug('s3stream completed: ' + fn);
                        clearInterval(intvl);
                        cb(completedErr);
                    }
                }, 100);
            }
        });
        const params = {
            Bucket: bucket,
            Key: path.join(prefix, fn),
            Body: s3stream
        };
        if (keyid) {
            params.ServerSideEncryption = 'aws:kms';
            params.SSEKMSKeyId = keyid;
        }
        let completed = false;
        let completedErr;
        console.info(`WRITE S3 URL: s3://${params.Bucket}/${params.Key}`);
        s3.upload(params, {
            queueSize,
            partSize
        })
            // .on('httpUploadProgress', (progress) => {
            //   process.stderr.write(progress.part.toLocaleString())
            // })
            // .on('error', console.error)
            .promise()
            .then(() => {
            console.debug('S3 upload stream complete');
            completed = true;
            // s3stream.destroy()
        })
            .catch((err) => {
            console.error(err);
            completed = true;
            completedErr = err;
            // s3stream.destroy(err)
        });
        return stream;
    };
}
exports.bkS3 = bkS3;
//# sourceMappingURL=s3.js.map