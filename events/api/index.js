import eventSchema from './event.gql'
import rootSchema from './schema.gql'
import { makeExecutableSchema } from 'graphql-tools';
import { URLResolver, URLTypeDefinition, DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars';
import { graphqlSync, introspectionQuery  } from 'graphql';

const executableSchema = makeExecutableSchema({
  typeDefs: [
    rootSchema,
    eventSchema,
    URLTypeDefinition,
    DateTimeTypeDefinition
  ],
  resolvers: {
    URL: URLResolver,
    DateTime: DateTimeResolver
  }
})

export const schema = graphqlSync(executableSchema, introspectionQuery).data
export const resolvers = [ URLResolver, DateTimeResolver ]
