import { IntrospectionQuery } from 'graphql';
import { URLResolver, DateTimeResolver } from 'graphql-scalars';

export const schema: IntrospectionQuery
export const resolvers: [ typeof URLResolver, typeof DateTimeResolver ]