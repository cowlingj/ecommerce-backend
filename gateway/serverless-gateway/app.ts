import 'source-map-support/register';
import express from 'express';
import { ApolloServer, makeRemoteExecutableSchema, introspectSchema, mergeSchemas } from 'apollo-server-express';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch'

export default async () => {
  const app = express();

  const productsLink = new HttpLink({
    fetch,
    uri: process.env.PRODUCTS_URI
  })

  const eventsLink = new HttpLink({
    fetch,
    uri: process.env.EVENTS_URI
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
