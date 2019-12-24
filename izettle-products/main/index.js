const { ApolloServer, gql } = require('apollo-server');

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

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({
  port: parseInt(process.env.PORT) || 80,
  host: process.env.HOST || "0.0.0.0"
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
