import { makeExecutableSchema } from 'graphql-tools'
import * as lib from '../index'
import testSchema from './test-data/schema.gql'
import query from './test-data/query.gql'
import { graphql, GraphQLError } from 'graphql'
import gql from 'graphql-tag'

describe('sort directive', () => {
  const people = [
    { name: "amy", age: 26, friends: [], address: {
      number: 2,
      postcode: 'A3 2AA'
    } },
    { name: "amy", age: 22, friends: [], address: { postcode: 'A4 2AA' } },
    { name: "clare", age: 45, friends: [
      { name: "ellie", age: 60, friends: [], address: { postcode: 'A1 2AA' } },
      { name: "dylan", age: 32, friends: [], address: { postcode: 'A1 1AA' } }
    ], address: {
      number: 1,
      postcode: 'A2 2AA'
    } },
    { name: "bob", age: 72, friends: [], address: { postcode: 'A1 2AA' } }
  ]

  const schema = makeExecutableSchema({
    typeDefs: [...lib.typeDefs, testSchema],
    resolvers: {
      Query: {
        peopleBy: () => people,
        peopleBySingle: () => people,
        personBy: () => people[0]
      }
    },
    schemaDirectives: {
      sort: lib.SortDirective
    }
  })

  it('works lexographically', async () => {
    const by = [ 'name' ]

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        by
      },
      "peopleBy"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleBy: [
      { name: "amy", age: 26 },
      { name: "amy", age: 22 },
      { name: "bob", age: 72 },
      { name: "clare", age: 45 }
    ] })
  })

  it('works numerically', async () => {
    const by = [ 'age' ]

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        by
      },
      "peopleBy"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleBy: [
      { name: "amy", age: 22 },
      { name: "amy", age: 26 },
      { name: "clare", age: 45 },
      { name: "bob", age: 72 }
    ] })
  })

  it('works with nested keys', async () => {
    const by = [ 'address', 'postcode' ]

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        by
      },
      "peopleBy"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleBy: [
      { name: "bob", age: 72 },
      { name: "clare", age: 45 },
      { name: "amy", age: 26 },
      { name: "amy", age: 22 }
    ] })
  })

  it('works with nested keys but null values', async () => {
    const by = [ 'address', 'number' ]

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        by
      },
      "peopleBy"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleBy: [
      { name: "clare", age: 45 },
      { name: "amy", age: 26 },
      { name: "amy", age: 22 },
      { name: "bob", age: 72 }
    ] })
  })

  it('works with string path argument', async () => {
    const by = 'age'

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        by
      },
      "peopleBySingle"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleBySingle: [
      { name: "amy", age: 22 },
      { name: "amy", age: 26 },
      { name: "clare", age: 45 },
      { name: "bob", age: 72 }
    ] })
  })

  it('works at multiple nesting levels', async () => {
    const by = [ 'age' ]

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        outerBy: [ 'age' ],
        innerBy: [ 'age' ]
      },
      "peopleByNested"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleBy: [
      { name: "amy", age: 22, friends: [] },
      { name: "amy", age: 26, friends: [] },
      { name: "clare", age: 45, friends: [
        { name: "dylan", age: 32 },
        { name: "ellie", age: 60 }
      ] },
      { name: "bob", age: 72, friends: [] }
    ] })
  })

  it('does not sort when variable is null/undefined', async () => {

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      null,
      "peopleBy"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleBy: [
      { name: "amy", age: 26 },
      { name: "amy", age: 22 },
      { name: "clare", age: 45 },
      { name: "bob", age: 72 }
    ] })
  })

  it('errors if non-list resolved results', async () => {
    const by = [ 'age' ]

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        by
      },
      "personBy"
    )

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toBeInstanceOf(GraphQLError)
    expect(result.data).toEqual({ personBy: null })
  })
})
