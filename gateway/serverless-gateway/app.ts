import 'source-map-support/register';
import express from 'express';
import { ApolloServer, makeRemoteExecutableSchema, introspectSchema, mergeSchemas } from 'apollo-server-express';
import { HttpLink } from 'apollo-link-http';
import fetch, { RequestInit } from 'node-fetch'
import { sign } from 'aws4'
import { URL } from 'url';

export default async () => {
  const app = express();

  const productsUri = new URL(process.env.PRODUCTS_URI)


  const productsFetchOptions: RequestInit = sign({
    method: 'POST',
    service: null,
    region: process.env.AWS_REGION,
    hostname: productsUri.host,
    pathname: productsUri.pathname,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const productsLink = new HttpLink({
    uri: productsUri.href,
    fetch: fetch,
    headers: productsFetchOptions.headers,
  })

  const eventsUri = new URL(process.env.EVENTS_URI)

  const eventsFetchOptions = sign({
    method: 'POST',
    service: null,
    region: process.env.AWS_REGION,
    hostname: eventsUri.host,
    pathname: eventsUri.pathname,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const eventsLink = new HttpLink({
    uri: eventsUri.href,
    fetch: fetch,
    headers: eventsFetchOptions.headers
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
    // playground: process.env.NODE_ENV === 'development' ? {
    //   endpoint: process.env.GRAPHQL_PLAYGROUND
    // } : false
  })
    
  server.applyMiddleware({ app, path: '/' })
  
  return app
}
