import productSchema from './product.gql'
import rootSchema from './schema.gql'
import { makeExecutableSchema } from 'graphql-tools';
import { URLResolver, URLTypeDefinition } from 'graphql-scalars';
import { graphqlSync, introspectionQuery  } from 'graphql';

const executableSchema = makeExecutableSchema({
  typeDefs: [
    rootSchema,
    productSchema,
    URLTypeDefinition
  ],
  resolvers: {
    URL: URLResolver
  }
})

export const schema = graphqlSync(executableSchema, introspectionQuery).data
export const resolvers = [ URLResolver ]
