import productSchema from './product.gql'
import rootSchema from './schema.gql'
import { buildClientSchema, printSchema } from 'graphql'

export const schema = printSchema(
  buildClientSchema([productSchema, rootSchema])
)
