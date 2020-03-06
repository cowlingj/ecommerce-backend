import { config } from "dotenv";
import {
  ApolloServer,
  introspectSchema,
  makeRemoteExecutableSchema
} from "apollo-server";
import { mergeSchemas } from "apollo-server";
import { GraphQLSchema, buildClientSchema, getIntrospectionQuery } from "graphql";
import { resolver as eventResolver } from "./resolvers/event";
import { resolver as eventsResolver } from "./resolvers/events";
import { schema as clientSchema } from "@cowlingj/events-api";

import { createLink } from "./link";
import { Server } from "http";

config();

const link = createLink();

export type PrismicEvent = {
  _meta: {
    uid: string;
  };
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  ical: {
    url: string;
  };
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  ical: string;
};

export const server: Promise<Server> = (async (): Promise<Server> => {
  if (
    process.env.KEYSTONE_URI === undefined ||
    process.env.PORT === undefined
  ) {
    throw new Error("environment variables not set up");
  }

  const introspectedSchema: GraphQLSchema = makeRemoteExecutableSchema({
    schema: await introspectSchema(link),
    link
  });

  const apollo = new ApolloServer({
    schema: mergeSchemas({
      schemas: [buildClientSchema(clientSchema)],
      resolvers: {
        Query: {
          event: eventResolver(introspectedSchema),
          events: eventsResolver(introspectedSchema)
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
