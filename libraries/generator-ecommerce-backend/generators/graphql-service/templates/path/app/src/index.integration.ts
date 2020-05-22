import ApolloClient, { gql } from "apollo-boost";
import fetch from "node-fetch";
import { Server, IncomingMessage } from "http";
import { promisify } from "util";
import allSettled from "promise.allsettled";

type Req = IncomingMessage & {
  body: { [key: string]: unknown };
};

describe("Server", () => {
  let serversToCloseAfterEachTest: Server[] = [];
  let client: ApolloClient<undefined>;

  beforeAll(() => {
    process.env.PORT = "3000";
    process.env.HOST = "localhost";

    client = new ApolloClient({
      uri: `http://${process.env.HOST}:${process.env.PORT}`,
      fetch: (fetch as unknown) as (
        input: RequestInfo,
        init?: RequestInit | undefined
      ) => Promise<Response>
    });
  });

  afterAll(() => {
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

  it("Can get a list of events", async () => {
    jest.resetModules();
    serversToCloseAfterEachTest.push(await require("./index").server);

    const res = await client.query({
      query: gql`
        {
          hello
        }
      `
    });

    expect(res.data.hello).toBe("hello world");
  });
});
