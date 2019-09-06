import ApolloClient, { gql } from 'apollo-boost'
import fetch from 'node-fetch'
import { fail } from 'assert';

const CMS_URL = "http://cms-test-service:80"

describe("graphql api", () => {

  const client = new ApolloClient({
    uri: `${CMS_URL}/graphql`,
    fetch
  })

  it("has at least 1 admin user", async () => {
    try {
      const query = await client.query({
        query: gql`{ users { id } }`
      })
      expect(query.data.users.length).toBeGreaterThan(0)
    } catch(e) {
      console.log(JSON.stringify(e, null, 2))
      fail()
    }
  })
  
  it('has a list of strings', async () => {
    try {
      await client.query({
        query: gql`{ strings { name } }`
      })
    } catch(e) {
      console.log(JSON.stringify(e, null, 2))
      fail()
    }
  })
})



