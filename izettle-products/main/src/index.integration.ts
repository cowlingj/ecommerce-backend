import { ApolloServer } from "apollo-server";
import ApolloClient, { gql } from "apollo-boost";
import fetch from "node-fetch";
import http from "http";
import { promisify } from "util";
import connect from "connect";
import path from "path";
import fs from "fs";
import { urlencoded } from "body-parser";

describe("Server", () => {
  let serversToCloseAfterEachTest: http.Server[] = [];
  let server: ApolloServer;
  let client: ApolloClient<undefined>;
  let originalHost: string | undefined;
  let originalPort: string | undefined;
  let testCredentials: {
    username: string;
    password: string;
    client_id: string;
    client_secret: string;
  };

  beforeAll(async () => {
    originalHost = process.env.HOST;
    originalPort = process.env.PORT;

    process.env.PORT = "3000";
    process.env.HOST = "localhost";
    process.env.IZETTLE_PRODUCTS_URI = "http://localhost:3001";
    process.env.IZETTLE_AUTH_URI = "http://localhost:3002";
    process.env.SECRETS_DIR = path.resolve(process.cwd(), "test", "secrets");
    process.env.IZETTLE_CREDENTIALS_FILE = "izettle_credentials.json";

    testCredentials = JSON.parse(
      fs.readFileSync(
        path.resolve(
          process.env.SECRETS_DIR,
          process.env.IZETTLE_CREDENTIALS_FILE
        ),
        "utf-8"
      )
    );

    server = require("./index").default;

    client = new ApolloClient({
      uri: `http://${process.env.HOST}:${process.env.PORT}`,
      fetch: (fetch as unknown) as (
        input: RequestInfo,
        init?: RequestInit | undefined
      ) => Promise<Response>
    });

    process.env.HOST = originalHost;
    process.env.PORT = originalPort;
  });

  afterAll(async () => {
    client.stop();
    await server.stop();
  });

  afterEach(async () => {
    await Promise.all(
      serversToCloseAfterEachTest.map(server =>
        promisify((cb: (err?: Error) => void) => server.close(cb))()
      )
    );
    serversToCloseAfterEachTest = [];
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
      __schema: {
        queryType: {
          name: "Query"
        }
      }
    });
  });

  it("Can get a list of products", async () => {
    const token = "token";
    const products = [
      {
        uuid: "uuid-1",
        name: "name-1",
        description: "",
        variants: [
          {
            uuid: "uuid",
            name: "",
            description: "",
            sku: "SKU123",
            price: {
              amount: 1,
              currencyId: "GBP"
            }
          }
        ],
        unitName: null,
        online: {
          status: "ACTIVE|HIDDEN",
          title: null,
          description: null,
          shipping: {
            shippingPricingModel: "FREE|STANDARD"
          }
        }
      }
    ];

    interface WithBody {
      body: { [key: string]: unknown };
    }
    interface Req extends http.IncomingMessage, WithBody {}

    const getTokenCalls: unknown[] = [];
    serversToCloseAfterEachTest.push(
      connect()
        .use(
          urlencoded({
            extended: false
          })
        )
        .use(
          "/token/",
          (
            _req: http.IncomingMessage,
            res: http.ServerResponse,
            next: Function
          ) => {
            const req = (_req as unknown) as Req;

            if (req.method !== "POST") {
              return next();
            }

            getTokenCalls.push({ contentType: req.headers["content-type"] });

            if (
              req.body["username"] !== testCredentials.username ||
              req.body["password"] !== testCredentials.password ||
              req.body["grant_type"] !== "password" ||
              req.body["client_id"] !== testCredentials.client_id ||
              req.body["client_secret"] !== testCredentials.client_secret
            ) {
              throw new Error(
                `client oauth get token body incorrect ${req.body}`
              );
            }
            res.setHeader("Content-Type", "application/json");
            res.end(
              /* eslint-disable @typescript-eslint/camelcase */
              JSON.stringify({
                access_token: token,
                refresh_token: null,
                expires_in: null
              })
              /* eslint-enable @typescript-eslint/camelcase */
            );
          }
        )
        .listen(3002)
    );

    const allProductsCalls: unknown[] = [];
    serversToCloseAfterEachTest.push(
      connect()
        .use(
          "/organizations/self/products/v2/",
          (
            req: http.IncomingMessage,
            res: http.ServerResponse,
            next: Function
          ) => {
            if (req.method !== "GET") {
              return next();
            }

            allProductsCalls.push(null);
            if (req.headers.authorization !== `Bearer ${token}`) {
              throw new Error(
                "no valid bearer token used for get all products"
              );
            }
            res.end(JSON.stringify(products));
          }
        )
        .listen(3001)
    );

    const res = await client.query({
      query: gql`
        {
          allProducts {
            id
            name
          }
        }
      `
    });

    expect(allProductsCalls).toEqual([null]);
    expect(getTokenCalls).toEqual([
      { contentType: "application/x-www-form-urlencoded" }
    ]);
    expect(res.data).toMatchObject({
      allProducts: [{ id: "uuid-1", name: "name-1" }]
    });
  });
});
