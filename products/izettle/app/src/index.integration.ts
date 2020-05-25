import ApolloClient, { gql } from "apollo-boost";
import fetch from "node-fetch";
import { Server, IncomingMessage, ServerResponse } from "http";
import { promisify } from "util";
import connect from "connect";
import path from "path";
import fs from "fs";
import { urlencoded } from "body-parser";
import allSettled from 'promise.allsettled'

describe("Server", () => {
  let serversToCloseAfterEachTest: Server[] = [];
  let server: Server;
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
    process.env.IZETTLE_AUTH_URI = "http://localhost:3002/token";
    process.env.IZETTLE_CREDENTIALS_FILE = path.resolve(
      process.cwd(),
      "test",
      "secrets",
      "izettle_credentials.json"
    );

    testCredentials = JSON.parse(
      fs.readFileSync(
        path.resolve(process.env.IZETTLE_CREDENTIALS_FILE),
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
    await promisify(server.close.bind(server))()
  });

  afterEach(async () => {
    await allSettled(
      serversToCloseAfterEachTest.map(server =>
        promisify(server.close.bind(server))()
      )
    );
    serversToCloseAfterEachTest = [];
  });

  it("Can get a list of products", async () => {
    const token = "token";
    const products = [
      {
        uuid: "uuid-1",
        name: "name-1",
        description: "",
        presentation: {
          imageUrl: "protocol://url-1"
        },
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
    type Req = IncomingMessage & WithBody

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
            _req: IncomingMessage,
            res: ServerResponse,
            next: Function
          ) => {
            const req = _req as Req;

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
                refresh_token: "refresh token",
                expires_in: 3600
              })
              /* eslint-enable @typescript-eslint/camelcase */
            );
          }
        )
        .listen(3002)
    );

    const productsCalls: unknown[] = [];
    serversToCloseAfterEachTest.push(
      connect()
        .use(
          "/organizations/self/products/v2/",
          (
            req: IncomingMessage,
            res: ServerResponse,
            next: Function
          ) => {
            if (req.method !== "GET") {
              return next();
            }

            productsCalls.push(null);
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
          products {
            id
            name
            imageUrl
          }
        }
      `
    });

    expect(productsCalls).toEqual([null]);
    expect(getTokenCalls).toEqual([
      { contentType: "application/x-www-form-urlencoded" }
    ]);
    expect(res.data).toMatchObject({
      products: [{ id: "uuid-1", name: "name-1", imageUrl: "protocol://url-1" }]
    });
  });
});
