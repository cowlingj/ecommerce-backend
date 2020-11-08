import 'source-map-support/register';
import express from 'express';
import { ApolloServer, makeRemoteExecutableSchema, introspectSchema, mergeSchemas } from 'apollo-server-express';
import { HttpLink } from 'apollo-link-http';
import { sign } from 'aws4'
import { URL } from 'url';
import fetch from 'node-fetch';

export default async () => {
  const app = express();

  const productsLink = new HttpLink({
    uri: process.env.PRODUCTS_URI,
    fetch: (url, opts) => {
      const targetUrl = new URL(url)
      const { headers } = sign({
        method: opts.method,
        service: 'execute-api',
        region: process.env.AWS_REGION,
        hostname: targetUrl.host,
        path: targetUrl.pathname,
        headers: {
          'Content-Type': 'application/json'
        },
        body: opts.body
      })
      return fetch(url, Object.assign({}, opts, { headers }))
    }
  })

  const eventsLink = new HttpLink({
    uri: process.env.EVENTS_URI,
    fetch: (url, opts) => {
      const targetUrl = new URL(url)
      const { headers } = sign({
        method: opts.method,
        service: 'execute-api',
        region: process.env.AWS_REGION,
        hostname: targetUrl.host,
        path: targetUrl.pathname,
        headers: {
          'Content-Type': 'application/json'
        },
        body: opts.body
      })
      return fetch(url, Object.assign({}, opts, { headers }))
    }
  })

  const server = new ApolloServer({
    schema: mergeSchemas({
      schemas: [
        makeRemoteExecutableSchema({
          schema: await introspectSchema(productsLink),
          link: productsLink
        }),
        makeRemoteExecutableSchema({
          schema: await introspectSchema(eventsLink),
          link: eventsLink
        })
      ],
    }),
    playground: process.env['NODE_ENV'] === 'development' ? {
      endpoint: process.env.GRAPHQL_PLAYGROUND
    } : false
  })

  server.applyMiddleware({ app, path: '/' })
  
  return app
}
