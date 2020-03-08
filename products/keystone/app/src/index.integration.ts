import ApolloClient, { gql } from "apollo-boost";
import fetch from "node-fetch";
import { Server, IncomingMessage, ServerResponse } from "http";
import { promisify } from "util";
import connect from "connect";
import allSettled from "promise.allsettled";

type Req = IncomingMessage & {
  body: { [key: string]: unknown };
};

function testServer<Tracking>(
  tracking: Tracking[],
  extract: (req: IncomingMessage) => Tracking,
  responses: unknown[],
  port: number
): Promise<Server> {
  let count = 0;
  const server = connect().use(
    "/",
    (_req: IncomingMessage, res: ServerResponse) => {
      const req = _req as Req;
      tracking.push(extract(req));

      let index = count;
      if (count >= responses.length) {
        index = responses.length - 1;
      }
      count++;

      res.end(responses[index]);
    }
  );
  return promisify<number, Server>((port, cb) => {
    const httpServer: Server = server.listen(port, () =>
      cb(undefined, httpServer)
    );
  })(port);
}

describe("Server", () => {
  let serversToCloseAfterEachTest: Server[] = [];
  let client: ApolloClient<undefined>;

  beforeAll(async () => {
    process.env.PORT = "3000";
    process.env.HOST = "localhost";
    process.env.KEYSTONE_URI = "http://localhost:3001/";

    client = new ApolloClient({
      uri: `http://${process.env.HOST}:${process.env.PORT}`,
      fetch: (fetch as unknown) as (
        input: RequestInfo,
        init?: RequestInit | undefined
      ) => Promise<Response>
    });
  });

  afterAll(async () => {
    client.stop();
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
    const keystoneProducts = [
      {
        id: "id-0",
        name: "name-0",
        imageUrl: "imageUrl-0",
        price: 100,
        currency: "GBP"
      },
      {
        id: "id-1",
        name: "name-1",
        imageUrl: "imageUrl-1",
        price: 101,
        currency: "GBP"
      }
    ];

    const productsCalls: {
      method: string;
      auth: string;
    }[] = [];

    serversToCloseAfterEachTest.push(
      await testServer(
        productsCalls,
        () => null,
        [
          JSON.stringify({ data: { allProducts: keystoneProducts } })
        ],
        3001
      )
    );

    jest.resetModules();
    const server: Server = await require("./index").server;

    serversToCloseAfterEachTest.push(server);

    const res = await client.query({
      query: gql`
        {
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

    expect(res.data.products.length).toBe(2);
    expect(res.data.products[0]).toMatchObject(      {
      id: "id-0",
      name: "name-0",
      imageUrl: "imageUrl-0",
      price: {
        value: 100,
        currency: "GBP"
      }
    });
    expect(res.data.products[1]).toMatchObject(      {
      id: "id-1",
      name: "name-1",
      imageUrl: "imageUrl-1",
      price: {
        value: 101,
        currency: "GBP"
      }
    });
    expect(productsCalls.length).toBe(1);
  });

  it("Can get a single product", async () => {
    const expectedId = "product_id";

    const keystoneProduct = {
      id: expectedId,
      name: "name-0",
      imageUrl: "imageUrl-0",
      price: 100,
      currency: "GBP"
    };

    const productsCalls: {
      method: string;
      auth: string;
    }[] = [];

    serversToCloseAfterEachTest.push(
      await testServer(
        productsCalls,
        () => null,
        [
          JSON.stringify({ data: { Product: keystoneProduct } })
        ],
        3001
      )
    );

    jest.resetModules();
    const server: Server = await require("./index").server;

    serversToCloseAfterEachTest.push(server);

    const res = await client.query({
      query: gql`
        {
          product(id: "${expectedId}") {
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

    expect(res.data.product).toMatchObject({
      id: expectedId,
      name: "name-0",
      imageUrl: "imageUrl-0",
      price: {
        value: 100,
        currency: "GBP"
      }
    });
    expect(productsCalls.length).toBe(1);
  });
});
