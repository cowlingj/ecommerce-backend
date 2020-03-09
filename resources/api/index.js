import stringSchema from './string.gql'
import rootSchema from './schema.gql'
import { makeExecutableSchema } from 'graphql-tools';
import { graphqlSync, getIntrospectionQuery  } from 'graphql';

const executableSchema = makeExecutableSchema({
  typeDefs: [
    rootSchema,
    stringSchema,
  ],
  resolvers: {}
})

export const schema = graphqlSync(executableSchema, getIntrospectionQuery()).data
export const resolvers = []
