import { makeExecutableSchema } from 'graphql-tools'
import * as lib from '../index'
import testSchema from './test-data/schema.gql'
import query from './test-data/query.gql'
import { graphql, GraphQLError } from 'graphql'

describe('filter directive', () => {

  const people = [
    { name: "amy", age: 26, friends: [] },
    { name: "bob", age: 45, friends: [] },
    { name: "clare", age: 72, friends: [
      { name: "ellie", age: 30, friends: [] },
      { name: "fred", age: 52, friends: [] }
    ] },
    { name: "dylan", age: 10, friends: [] }
  ]

  const schema = makeExecutableSchema({
    typeDefs: [...lib.typeDefs, testSchema],
    resolvers: {
      Query: {
        peopleLike: () => people,
        peopleLikeSingle: () => people,
        personLike: () => people[0]
      }
    },
    schemaDirectives: {
      filter: lib.FilterDirective
    }
  })

  it('works with list of possible matches', async () => {

    const like = [
      { name: "bob" }, { age: 26 }
    ]

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        like
      },
      "peopleLike"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleLike: [
      { name: "amy", age: 26 },
      { name: "bob", age: 45 }
    ] })
  })

  it('works with a single match', async () => {

    const like = { name: "bob" }

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        like
      },
      "peopleLikeSingle"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleLikeSingle: [ { name: "bob", age: 45 } ] })
  })

  it('does not filter when variable is null/undefined', async () => {

    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      null,
      "peopleLike"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({ peopleLike: [
      { name: "amy", age: 26 },
      { name: "bob", age: 45 },
      { name: "clare", age: 72 },
      { name: "dylan", age: 10 }
    ] })
  })

  it('works with a nested matches', async () => {

    const like = {
      outerLike: { name: "clare" },
      innerLike: { name: "fred" }
    }


    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      like,
      "peopleLikeNested"
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({
      peopleLike: [
        {
          name: "clare",
          age: 72, friends: [
            { name: "fred", age: 52 }
          ]
        }
      ]
    })
  })

  it('errors non-list resolved result', async () => {

    const like = { name: "clare" }


    const result = await graphql(
      schema,
      query.loc.source.body,
      null,
      null,
      {
        like
      },
      "personLike"
    )

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toBeInstanceOf(GraphQLError)
    expect(result.data).toEqual({ personLike: null })
  })
})
