import { S3 } from 'aws-sdk';
import allSettled from 'promise.allsettled';
import { parseICS, VEvent } from 'node-ical'
import { PromiseResolvedResult } from './promise.allsettled.types';
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express'

let cache = {
  expiresAt: Date.now() / 1000,
  events: null
}

export default () => {

const s3 = new S3()
async function getEvents() {
  if (!cache.events || cache.expiresAt < Date.now() / 1000) {
    cache = {
      events: s3
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
        .map((p) => parseICS(
          (p as PromiseResolvedResult<S3.GetObjectOutput>).value.Body?.toString()
        ))
        .map(c => Object.values(c))
        .flat()
        .filter((comp): comp is VEvent => comp.type === 'VEVENT')
        .map((vevent) => {
          console.log(JSON.stringify(vevent))
          return {
            id: vevent.uid ?? '',
            title: vevent.summary,
            description: vevent.description,
            location: vevent.location,
            start: vevent.start.toISOString(),
            end: vevent.end.toISOString(),
            url: vevent.url
          }
        })
      ),
      expiresAt: Date.now() / 1000 + parseInt(process.env.CACHE_TTL)
    } 
  }

  return cache.events
}

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
        events: async () => getEvents(),
        event: async (_parent, { id }: { id: string }) => (
          (await getEvents()).find(({ id: itemId }) => itemId === id)
        )
      }
    }
  })

  server.applyMiddleware({ app, path: '/' })
  return app

}
