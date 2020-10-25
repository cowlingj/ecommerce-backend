import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { S3 } from 'aws-sdk';
import allSettled from 'promise.allsettled';
import { parseICS } from 'node-ical'
import { PromiseResolvedResult } from './promise.allsettled.types'

const s3 = new S3()
const icsPromise = s3
  .listObjectsV2({
    Bucket: process.env.BUCKET
  })
  .promise()
  .then(res => 
    allSettled(
      res.Contents?.map(
        s3Obj => s3.getObject({
          Bucket: process.env.BUCKET,
          Key: s3Obj.Key
        }).promise()
      )
    )
  )
  .then(res => res
    .filter((p) => p.status === 'fulfilled')
    .map(
      (p) => (
        parseICS((p as PromiseResolvedResult<S3.GetObjectOutput>).value.Body?.toString())
      )
    )
    .map(c => Object.values(c))
    .flat()
    .filter(({ type }) => type === 'VEVENT')
    .map(({ description, location, summary, start, end, url }) => ({
      name: summary,
      description,
      location,
      start,
      end,
      url
    }))
  )

export const all: APIGatewayProxyHandler = async () => {
  const ics = (await icsPromise)
  return {
    statusCode: 200,
    body: JSON.stringify(ics),
  };
}
