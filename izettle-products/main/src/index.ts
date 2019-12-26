import { ApolloServer } from 'apollo-server'
import dotenv from 'dotenv'
import typeDefs from '@/schema.gql'

dotenv.config()

const resolvers = {
  Query: {
    allProducts: (): never[] => [],
  },
};

const server = new ApolloServer({ typeDefs, resolvers, playground: process.env.NODE_ENV === 'development' });

server.listen({
  port: parseInt(process.env.PORT as string) || 80,
  host: process.env.HOST ?? "0.0.0.0"
}).then(({ url }: { url: string }) => {
  console.log(`Server ready at ${url}`);
});

export default server;
