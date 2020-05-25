import fetch from "node-fetch";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { resolve } from "path";
import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs";
import { transform } from "./from-json";

describe("server", () => {
  const productsFilename = resolve(__dirname, "test-data", "products.json");
  const products = transform(JSON.parse(readFileSync(productsFilename, "utf-8")).products);

  let server: ApolloServer | undefined;
  let client: ApolloClient<unknown> | undefined;

  beforeAll(() => {
    jest.resetModules();
    process.env.PORT = "8080";
    process.env.PRODUCTS_FILE = productsFilename;

    server = require("@/index").server;

    client = new ApolloClient({
      fetch: (fetch as unknown) as (
        input: RequestInfo,
        init?: RequestInit | undefined
      ) => Promise<Response>,
      uri: `http://localhost:${process.env.PORT}/`
    });
  });

  afterAll(async () => {
    client?.stop();
    await server?.stop();
  });

  it("gets list of products", async () => {
    const res = await client?.query({
      query: gql`
        query {
          products {
            id
            name
            imageUrl
            price {
              value
              currency
            }
          }
        }
      `
    });

    expect(res?.errors).toBeUndefined;
    expect(res?.data).toMatchObject({ products });
  });

  it("gets single product", async () => {
    const res = await client?.query({
      query: gql`
        query {
          product(id: "0") {
            id
            name
            imageUrl
            price {
              value
              currency
            }
          }
        }
      `
    });

    expect(res?.errors).toBeUndefined;
    expect(res?.data).toMatchObject({ product: products[0] });
  });
});
