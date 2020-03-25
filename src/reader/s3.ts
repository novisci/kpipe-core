import * as AWS from 'aws-sdk'
import * as path from 'path'
import { ReadableStreamGenerator } from '../backend'
import { Readable } from 'node-typestream'
import { StreamTracker } from '../stream-tracker'

type Opts = {
  bucket?: string
  region?: string
  prefix?: string
}

export function bkS3 (options: Opts = {}): ReadableStreamGenerator<Buffer> {
  if (!options.bucket || !options.region) {
    throw new Error('S3 reader requires options.bucket and options.region')
  }

  const s3 = new AWS.S3({
    apiVersion: '2017-08-08',
    region: options.region
  })

  const bucket = options.bucket
  const prefix = options.prefix || ''

  return (key: string): Readable<Buffer> => {
    const params = {
      Bucket: bucket,
      Key: path.join(prefix, key)
    }
    console.info(`READ S3 URL: s3://${params.Bucket}/${params.Key}`)

    const request = s3.getObject(params)
    const stream = request.createReadStream() as unknown as Readable<Buffer>

    request.on('httpHeaders', (status, headers) => {
      if (headers['content-length']) {
        stream.emit('notify', {
          type: 'readsize',
          size: BigInt(headers['content-length'])
        })
      }
    })

    return StreamTracker(stream as Readable<Buffer>)
  }
}
