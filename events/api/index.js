import eventSchema from './event.gql'
import rootSchema from './schema.gql'
import { makeExecutableSchema } from 'graphql-tools';
import { URLResolver, URLTypeDefinition } from 'graphql-scalars';
import { graphqlSync, introspectionQuery  } from 'graphql';

const executableSchema = makeExecutableSchema({
  typeDefs: [
    rootSchema,
    eventSchema,
    URLTypeDefinition
  ],
  resolvers: {
    URL: URLResolver
  }
})

export const schema = graphqlSync(executableSchema, introspectionQuery).data
export const resolvers = [ URLResolver ]
