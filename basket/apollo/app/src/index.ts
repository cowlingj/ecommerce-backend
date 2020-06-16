import { config } from "dotenv";
import { ApolloServer } from "apollo-server-express";
import schemaTypeDefs from "./schema.gql";
import basketTypeDefs from "./basket.gql";
import { schema as productsSchema } from "@cowlingj/products-api";
import { mergeSchemas } from "@graphql-tools/merge"
import { Server, createServer } from "http";
import { buildClientSchema } from "graphql";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa"
import { promisify } from "util"
import express from "express"
import cookieParser from "cookie-parser"
// import { connect, Schema, model } from "mongoose"

config();

const client = process.env.JWKS_URI ? jwksClient({
  jwksUri: process.env.JWKS_URI
}) : undefined;

// const itemsSchema = new Schema({

// })

// const discountCodesSchema = new Schema({

// })

// const basketSchema = new Schema({
//   items: itemsSchema,
//   discountCodes: discountCodesSchema
// })

export const server: Promise<Server> = (async (): Promise<Server> => {

  let lastKey: string | undefined
  let lastKid: string | undefined

  const apollo = new ApolloServer({
    schema: mergeSchemas({
      schemas: [
        buildClientSchema(productsSchema)
      ],
      typeDefs: [schemaTypeDefs, basketTypeDefs],
      resolvers: {
        Query: {
          myBasket: () => ({})
        },
        DiscountCodes: {
          totalCount: () => 0,
          edges: () => [],
          pageInfo: () => ({
            startCursor: "start",
            endCursor: "end",
            hasNextPage: false
          })
        },
        Basket: {
          items: (
            _parent: any,
            args: { before: string | undefined, after: string | undefined, first: number | undefined, last: number | undefined },
            { user, cookieBasket }: { user: any | undefined, cookieBasket: any[] | undefined }) => {

            // TODO: use 'graphql-validation-complexity'
            const before = args.before,
                  after = args.after;

            let first = 100, last = 0;
            if (args.first || args.last) {
              first = Math.min(100, args.first ?? 0),
              last = Math.min(100, args.last ?? 0);
            }

            if (user) {
              // TODO: mongoose
            }

            if (cookieBasket) {
              let cursorIndex = 0
              let startCursor = null
              let endCursor = null
              let startIndex = 0
              let endIndex = null
              if (after) {
                cursorIndex = cookieBasket.findIndex((item) => item === after)
                startIndex = cursorIndex + 1 > cookieBasket.length ? 0 : cursorIndex + 1
                endIndex = cursorIndex + first > cookieBasket.length  ? cookieBasket.length : cursorIndex + first

              } else if (before) {
                cursorIndex = cookieBasket.findIndex((item) => item === before)
                startIndex = cursorIndex - 1 < 0 ? cookieBasket.length : cursorIndex - 1
                endIndex = cursorIndex - last < 0 ? 0 : cursorIndex - last
              
              }

              startCursor = startIndex == null ? null : cookieBasket[startIndex]
              endCursor = endIndex == null ? null : cookieBasket[endIndex]

              const items = startIndex === null || endIndex === null
                ? []
                : cookieBasket.slice(
                    Math.min(startIndex, endIndex + 1),
                    Math.max(startIndex, endIndex + 1)
                  )

              return {
                totalCount: cookieBasket.length,
                edges: items.map(item => ({ node: item, cursor: item })),
                pageInfo: {
                  startCursor,
                  endCursor,
                  hasNextPage: endCursor !== null
                }
              }
            }

            return {
              totalCount: 0,
              edges: [],
              pageInfo: {
                startCursor: null,
                endCursor: null,
                hasNextPage: false
              }
            };
          },
          discountCodes: () => ({})
        }
      }
    }),
    playground: process.env.NODE_ENV === "development",
    context: async ({ req }) => {

      let context: {
        user: any | undefined,
        cookieBasket: any | undefined
      } = {
        user: undefined,
        cookieBasket: undefined
      }

      if (req.headers.authorization && client) {
        const token = req.headers.authorization;
        const { header: { kid } } = jwt.decode(token, { complete: true }) as unknown as { header: {kid: string } };

        // cache last public key to save making the request everytime
        const publicKey = lastKid === kid && lastKey ? lastKey : (await promisify(client.getSigningKey.bind(client))(kid)).getPublicKey();
        lastKey = publicKey
        lastKid = kid

        context.user = await promisify(jwt.verify.bind(jwt))(token, publicKey);
      }

      if (req.cookies.basket) {
        context.cookieBasket = JSON.parse(req.cookies.basket)
      }

      return context
    }
  });

  const app = express();
  app.use(cookieParser());
  app.use(apollo.getMiddleware({ path: "/" }));
  const server = createServer(app);
  await promisify(server.listen.bind(server))(process.env.PORT);
  console.log(
    `Server ready at http://${process.env.HOST || "localhost"}:${
      process.env.PORT
    }`
  );
  return server
})();
