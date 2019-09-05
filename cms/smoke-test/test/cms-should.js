import ApolloClient, { gql } from 'apollo-boost'
import fetch from 'node-fetch'
import { fail } from 'assert';

describe("graphql api", () => {

  const client = new ApolloClient({
    uri: 'http://cms/graphql',
    fetch
  })

  it("has at least 1 admin user", async () => {
    const query = await client.query({
      query: gql`{ users { id } }`
    })
    expect(query.data.users.length).toBeGreaterThan(0)
  })
  
  it('has a list of strings', async () => {
      await client.query({
        query: gql`{ strings { name } }`
      })
  })
})



