import { ApolloServer } from "apollo-server-express";
import express from "express"
import { schema as productSchema } from "@cowlingj/products-api";
import { config } from "dotenv";
import { resolver as productsResolver } from '@/resolvers/products'
import { resolver as productResolver } from '@/resolvers/product'
import auth from "@/auth/auth"
import fetch from 'node-fetch'
import fs from 'fs'
import { mergeSchemas } from "apollo-server";
import { buildClientSchema } from "graphql";

export type IzettleProduct = {
  uuid: string,
  name: string,
  presentation: { imageUrl: string | null } | null,
  variants: IzettleVariant[]
}

export type IzettleVariant = {
  price: {
    amount: number,
    currencyId: string
  } | null
}

export type Product = {
  id: string;
  name: string;
  imageUrl: string | null
  price: {
    value: number,
    currency: string
  }
}

config()

if (
  process.env.IZETTLE_AUTH_URI === undefined ||
  process.env.IZETTLE_PRODUCTS_URI === undefined ||
  process.env.IZETTLE_CREDENTIALS_FILE === undefined
) {
  throw new Error("environment variables not set up");
}

const credentials: {
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
} = JSON.parse(
  fs.readFileSync(process.env.IZETTLE_CREDENTIALS_FILE, "utf8")
);

const apollo = new ApolloServer({
  schema: mergeSchemas({
    schemas: [buildClientSchema(productSchema)],
    resolvers: {
      Query: {
        product: productResolver,
        products: productsResolver,
      }
    }
  }),
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
