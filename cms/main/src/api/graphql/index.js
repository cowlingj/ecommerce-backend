const { ApolloServer } = require('apollo-server-express')
const { importSchema } = require('graphql-import')
const keystone = require('keystone')
const path = require('path')

const server = new ApolloServer({
  typeDefs: importSchema(path.join(__dirname, 'schema', 'schema.graphql')),
  debug: process.env.NODE_ENV == 'development',
  playground: process.env.NODE_ENV == 'development',
  resolvers: {
    Query: {
      strings: async () => await keystone.list('String').model.find().exec()
    }
  },
});

module.exports = {
  default: (app) => {
    server.applyMiddleware({ app, path: '/graphql' })
  }
}