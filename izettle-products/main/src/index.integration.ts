import { ApolloServer } from "apollo-server";
import ApolloClient, { gql } from 'apollo-boost';
import fetch from 'node-fetch'

describe("Server", () => {
  let server: ApolloServer
  let client: ApolloClient<undefined>
  let originalHost: string | undefined;
  let originalPort: string | undefined;

  beforeAll(() => {
    originalHost = process.env.HOST;
    originalPort = process.env.PORT;

    process.env.PORT = "3000";
    process.env.HOST = "localhost";

    server = require("./index").default;

    client = new ApolloClient({
      uri: `http://${process.env.HOST}:${process.env.PORT}`,
      fetch
    })

    process.env.HOST = originalHost;
    process.env.PORT = originalPort;
  });

  afterAll(async () => {
    await server.stop();
    client.stop();
  });

  it("is running at uri", async () => {
    const res = await client.query({
      query: gql`
        {
          __schema {
            queryType {
              name
            }
          }
        }
      `
    });

    expect(res.data).toMatchObject({
      "__schema": {
        "queryType": {
          "name": "Query"
        }
      }
    })
  })

  it("Can get a list of products", async () => {
    const res = await client.query({
      query: gql`
        {
          allProducts {
            id
          }
        }
      `
    });

    expect(res.data).toMatchObject({ allProducts: []})
  });
});
