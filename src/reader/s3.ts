const AWS = require('aws-sdk')
const path = require('path')

module.exports = function (options) {
  if (!options.bucket || !options.region) {
    throw new Error('S3 reader requires options.bucket and options.region')
  }

  var s3 = new AWS.S3({
    apiVersion: '2017-08-08',
    region: options.region
  })

  const bucket = options.bucket
  const prefix = options.prefix || ''

  return (key) => {
    var params = {
      Bucket: bucket,
      Key: path.join(prefix, key)
    }
    console.info(`READ S3 URL: s3://${params.Bucket}/${params.Key}`)

    const request = s3.getObject(params)
    const stream = request.createReadStream()

    request.on('httpHeaders', (status, headers) => {
      if (headers['content-length']) {
        stream.emit('notify', {
          type: 'readsize',
          size: BigInt(headers['content-length'])
        })
      }
    })

    return require('../stream-tracker')(stream)
  }
}
