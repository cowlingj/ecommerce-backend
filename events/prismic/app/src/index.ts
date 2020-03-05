import { config } from "dotenv";
import {
  ApolloServer,
  makeExecutableSchema,
  introspectSchema,
  makeRemoteExecutableSchema
} from "apollo-server";
import { mergeSchemas } from "apollo-server";
import { GraphQLSchema, buildClientSchema } from "graphql";
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
    process.env.PRISMIC_REFS_URI === undefined ||
    process.env.PRISMIC_GRAPHQL_URI === undefined ||
    process.env.PRISMIC_ACCESS_TOKEN === undefined ||
    process.env.PRISMIC_EVENT_QUERY === undefined ||
    process.env.PRISMIC_EVENTS_QUERY === undefined ||
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
          event: eventResolver(
            introspectedSchema,
            process.env.PRISMIC_EVENT_QUERY
          ),
          events: eventsResolver(
            introspectedSchema,
            process.env.PRISMIC_EVENTS_QUERY
          )
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
