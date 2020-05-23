import { config } from "dotenv";
import { ApolloServer } from "apollo-server";
import typeDefs from "./hello.gql";

import { Server } from "http";

config();

export const server: Promise<Server> = (async (): Promise<Server> => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: {
        hello: (): "hello world" => "hello world"
      }
    },
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
