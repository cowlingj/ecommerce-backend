import { ApolloServer } from "apollo-server-express";
import express from "express"
import schema from "products-api/schema.gql";
import products from "products-api/product.gql";
import { config } from "dotenv";
import allProducts from '@/products/allProducts/allProducts'
import productById from './products/productById/productById'
import auth from "@/auth/auth"
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

config()

if (
  process.env.IZETTLE_AUTH_URI === undefined ||
  process.env.IZETTLE_PRODUCTS_URI === undefined ||
  process.env.IZETTLE_CREDENTIALS_FILE === undefined ||
  process.env.SECRETS_DIR === undefined
) {
  throw new Error("environment variables not set up");
}

const credentials: {
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
} = JSON.parse(
  fs.readFileSync(
    path.resolve(process.env.SECRETS_DIR, process.env.IZETTLE_CREDENTIALS_FILE),
    "utf8"
  )
);

const resolvers = {
  Query: {
    allProducts,
    productById
  }
};

const apollo = new ApolloServer({
  typeDefs: [schema, products],
  resolvers,
  playground: process.env.NODE_ENV === "development",
  context: ({req}) => req
});

const app = express()
app.use(auth({
  fetch,
  auth: {
    accessTokenUrl: `${process.env.IZETTLE_AUTH_URI}/token`,
    credentials: {
      username: credentials.username,
      password: credentials.password,
      clientId: credentials.client_id,
      clientSecret: credentials.client_secret
    }
  },
  key: "token"
}))
apollo.applyMiddleware({app, path: '*'})

const port = parseInt(process.env.PORT ? process.env.PORT : "") || 80
const host = process.env.HOST ? process.env.HOST : "0.0.0.0"

const server = app.listen(port, host, () => {
    console.log(`Server ready at ${host}:${port}`);
})

export default server;
