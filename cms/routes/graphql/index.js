const { ApolloServer } = require('apollo-server-express')
const { importSchema } = require('graphql-import')
const keystone = require('keystone')

const server = new ApolloServer({
  typeDefs: importSchema('./routes/graphql/schema/schema.graphql'),
  debug: true,
  playground: true,
  resolvers: {
    Query: {
      users: async () => await keystone.list('User').model.find().exec(),
      strings: async () => await keystone.list('String').model.find().exec()
    }
  },
});

module.exports = {
  default: (app) => {
    app.use('/graphql', (req, res, next) => {
      if (process.env.NODE_ENV !== 'development') {
        res.sendStatus(401) // call auth middleware
      } else {
        next()
      }
    })
    server.applyMiddleware({ app, path: '/graphql' })
  }
}