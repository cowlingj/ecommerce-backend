import { ApolloServer, gql } from 'apollo-server'
import dotenv from 'dotenv'

dotenv.config()

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    quantity: Int
  }

  type Query {
    allProducts: [Product]
  }
`

const resolvers = {
  Query: {
    allProducts: () => [],
  },
};

console.log(process.env.NODE_ENV)
const server = new ApolloServer({ typeDefs, resolvers, playground: process.env.NODE_ENV === 'development' });

server.listen({
  port: parseInt(process.env.PORT as string) || 80,
  host: process.env.HOST ?? "0.0.0.0"
}).then(({ url }: { url: any }) => {
  console.log(`Server ready at ${url}`);
});
