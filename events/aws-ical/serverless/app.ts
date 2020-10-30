import { S3 } from 'aws-sdk';
import allSettled from 'promise.allsettled';
import { parseICS, VEvent } from 'node-ical'
import { PromiseResolvedResult } from './promise.allsettled.types';
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express'

export default () => {

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
      .filter((comp): comp is VEvent => comp.type === 'VEVENT')
      .map(({ uid, description, location, summary, start, end, url }) => ({
        id: uid ?? '',
        name: summary,
        description,
        location,
        start: start.toISOString(),
        end: end.toISOString(),
        url
      }))
    )

  const app = express()

  const server = new ApolloServer({
    typeDefs: gql`
      type Event {
      id: ID!
      title: String
      description: String
      location: String
      ical: String
      start: String
      end: String
      url: String
    }

    input EventOrderInput {
      field: String!
      reverse: Boolean
    }

    type Query {
      event(id: ID!): Event
      events(count: Int, order: EventOrderInput): [Event!]!
    }
  `,
    resolvers: {
      Query: {
        events: async () => icsPromise,
        event: async (_parent, { id }: { id: string }) => (
          (await icsPromise).find(({ id: itemId }) => itemId === id)
        )
      }
    }
  })

  server.applyMiddleware({ app, path: '/' })
  return app

}
