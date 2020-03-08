import { config } from "dotenv";
import {
  ApolloServer,
  introspectSchema,
  makeRemoteExecutableSchema
} from "apollo-server";
import { mergeSchemas } from "apollo-server";
import { GraphQLSchema, buildClientSchema, getIntrospectionQuery } from "graphql";
import { resolver as productResolver } from "./resolvers/product";
import { resolver as productsResolver } from "./resolvers/products";
import { schema as clientSchema } from "@cowlingj/products-api";
import introspectionQueryResult from "./data/introspection-result.json";

import { createLink } from "./link";
import { Server } from "http";

config();

const link = createLink();

export const server: Promise<Server> = (async (): Promise<Server> => {
  if (
    process.env.KEYSTONE_URI === undefined ||
    process.env.PORT === undefined
  ) {
    throw new Error("environment variables not set up");
  }

  const introspectedSchema: GraphQLSchema = makeRemoteExecutableSchema({
    // @ts-ignore
    schema: buildClientSchema(introspectionQueryResult.data),
    link
  });

  const apollo = new ApolloServer({
    schema: mergeSchemas({
      schemas: [buildClientSchema(clientSchema)],
      resolvers: {
        Query: {
          product: productResolver(introspectedSchema),
          products: productsResolver(introspectedSchema)
        }
      }
    }),
    playground: process.env.NODE_ENV === "development"
  });

  return apollo
    .listen(process.env.PORT, () => {
      console.log(
        `Server ready at http://${process.env.HOST ?? "localhost"}:${
          process.env.PORT
        }`
      );
    })
    .then(({ server }) => server);
})();
