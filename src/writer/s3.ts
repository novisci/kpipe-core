import * as AWS from 'aws-sdk'
import { PassThrough, Writable } from 'tstream'
import * as path from 'path'
import { StreamGenerator } from '../backend'

type S3Params = {
  Bucket: string
  Key: string
  Body: PassThrough<Buffer>
  ServerSideEncryption?: 'aws:kms'
  SSEKMSKeyId?: string
}

type Opts = {
  bucket?: string
  region?: string
  prefix?: string
  key?: string
}

export default function (options: Opts = {}): StreamGenerator<Writable<Buffer>> {
  if (!options.bucket || !options.region) {
    throw new Error('S3 writer requires options.bucket and options.region')
  }

  const s3 = new AWS.S3({
    apiVersion: '2017-08-08',
    region: options.region
  })

  const bucket = options.bucket
  const prefix = options.prefix || ''
  const keyid = options.key

  return (fn): Writable<Buffer> => {
    const s3stream = new PassThrough<Buffer>()
    const stream = new Writable<Buffer>({
      write: (chunk, enc, cb): void => {
        s3stream.write(chunk, enc, cb)
      },
      final: (cb): void => {
        s3stream.end()
        const intvl = setInterval(() => {
          if (completed) {
            console.debug('s3stream completed: ' + fn)
            clearInterval(intvl)
            cb(completedErr)
          }
        }, 100)
      }
    })

    const params: S3Params = {
      Bucket: bucket,
      Key: path.join(prefix, fn),
      Body: s3stream
    }

    if (keyid) {
      params.ServerSideEncryption = 'aws:kms'
      params.SSEKMSKeyId = keyid
    }

    let completed = false
    let completedErr: Error|undefined

    console.info(`WRITE S3 URL: s3://${params.Bucket}/${params.Key}`)

    s3.upload(params, {
      queueSize: 10,
      partSize: 5 * 1024 * 1024
    })
      // .on('httpUploadProgress', (progress) => {
      //   process.stderr.write(progress.part.toLocaleString())
      // })
      // .on('error', console.error)
      .promise()
      .then(() => {
        console.debug('upload stream complete')
        completed = true
        s3stream.destroy()
      })
      .catch((err: Error|undefined) => {
        console.error(err)
        completed = true
        completedErr = err
        s3stream.destroy(err)
      })

    return stream
  }
}
