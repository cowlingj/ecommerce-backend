import express from "express"
import { config } from "dotenv";
import auth from "./auth/auth"
import transform from './transform'
import fetch from 'node-fetch'
import { ApolloServer, gql, Request } from 'apollo-server-express'

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
  process.env.IZETTLE_API_KEY === undefined
) {
  throw new Error("environment variables not set up");
}

const app = express()
app.use(auth({
  auth: {
    accessTokenUrl: process.env.IZETTLE_AUTH_URI,
    apiKey: process.env.IZETTLE_API_KEY
  },
  key: "token"
}))

const server = new ApolloServer({
  typeDefs: gql`
    type Product {
      id: ID!
      name: String!
      imageUrl: String
      price: ProductPrice!
    }

    type ProductPrice {
      value: Int!
      currency: String!
    }

    type Query {
      products: [Product!]!
      product(id: ID!): Product
    }
  `,
  resolvers: {
    Query: {
      products: async (_parent, _args, ctx, _info) => {
        const productsResult = await fetch(
          `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/v2/`,
          {
            headers: {
              Authorization: `Bearer ${ctx.token}`
            }
          }
        );
        if (!productsResult.ok) {
          throw new Error(await productsResult.text());
        }
        return (await productsResult.json() as IzettleProduct[])
          .map(transform)
          .filter((product) => product != null) as Product[];
      },
      product: async (_parent, { id }, ctx, _info) => {
        const productsResult = await fetch(
          `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${ctx.token}`
            }
          }
        );
        if (!productsResult.ok) {
          throw new Error(await productsResult.text());
        }
        return transform((await productsResult.json() as IzettleProduct))
      }
    }
  },
  context: ({ req: { token }}: { req: Request & { token: string } }) => ({ token })
})

server.applyMiddleware({ app, path: '/'})

export default app;
