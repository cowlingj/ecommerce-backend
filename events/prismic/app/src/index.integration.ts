import ApolloClient, { gql } from "apollo-boost";
import fetch from "node-fetch";
import { Server, IncomingMessage, ServerResponse } from "http";
import { promisify } from "util";
import connect from "connect";
import allSettled from "promise.allsettled";
import path from "path";
import fs from "fs";

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

const introspectionQueryResult: string = fs.readFileSync(
  path.resolve(__dirname, "test-data", "introspection-result.json"),
  "utf-8"
);

describe("Server", () => {
  let serversToCloseAfterEachTest: Server[] = [];
  let client: ApolloClient<undefined>;

  beforeAll(async () => {
    process.env.PORT = "3000";
    process.env.HOST = "localhost";
    process.env.PRISMIC_REFS_URI = "http://localhost:3001/";
    process.env.PRISMIC_GRAPHQL_URI = "http://localhost:3002/";
    process.env.PRISMIC_ACCESS_TOKEN = "PRISMIC_ACCESS_TOKEN";
    process.env.PRISMIC_EVENT_QUERY = "event";
    process.env.PRISMIC_EVENTS_QUERY = "allEvents";

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

  it("Can get a list of events", async () => {
    const refs = { refs: [{ id: "master", ref: "ref1" }] };
    const refsCalls: { method?: string; bearer?: string }[] = [];
    serversToCloseAfterEachTest.push(
      await testServer(
        refsCalls,
        req => ({ method: req.method, auth: req.headers["authorization"] }),
        [JSON.stringify(refs)],
        3001
      )
    );

    const prismaEvents = {
      edges: [
        {
          node: {
            _meta: {
              uid: "id-0"
            },
            title: "title-0",
            start: "start-0",
            end: "end-0",
            location: "location-0",
            description: "description-0",
            ical: {
              __typename: "_ExternalLink",
              url: "ical-0"
            }
          }
        },
        {
          node: {
            _meta: {
              uid: "id-1"
            },
            title: "title-1",
            start: "start-1",
            end: "end-1",
            location: "location-1",
            description: "description-1",
            ical: {
              __typename: "_ExternalLink",
              url: "ical-1"
            }
          }
        }
      ]
    };

    const eventsCalls: {
      method: string;
      auth: string;
    }[] = [];
    serversToCloseAfterEachTest.push(
      await testServer(
        eventsCalls,
        req => ({
          method: req.method,
          auth: req.headers["authorization"]
        }),
        [
          introspectionQueryResult,
          JSON.stringify({ data: { allEvents: prismaEvents } })
        ],
        3002
      )
    );

    jest.resetModules();
    const server: Server = await require("./index").server;

    serversToCloseAfterEachTest.push(server);

    const res = await client.query({
      query: gql`
        {
          events {
            id
            title
            start
            end
            location
            description
            ical
          }
        }
      `
    });

    expect(res.data.events.length).toBe(2);
    expect(res.data.events[0]).toMatchObject({
      description: "description-0",
      end: "end-0",
      ical: "ical-0",
      id: "id-0",
      location: "location-0",
      start: "start-0",
      title: "title-0"
    });
    expect(res.data.events[1]).toMatchObject({
      description: "description-1",
      end: "end-1",
      ical: "ical-1",
      id: "id-1",
      location: "location-1",
      start: "start-1",
      title: "title-1"
    });
    expect(refsCalls).toEqual([
      {
        auth: "Token PRISMIC_ACCESS_TOKEN",
        method: "GET"
      },
      {
        auth: "Token PRISMIC_ACCESS_TOKEN",
        method: "GET"
      }
    ]);
    expect(eventsCalls.length).toBe(2);
    expect(eventsCalls).toMatchObject([
      {
        method: "GET",
        auth: "Token PRISMIC_ACCESS_TOKEN"
      },
      {
        method: "GET",
        auth: "Token PRISMIC_ACCESS_TOKEN"
      }
    ]);
  });

  it("Can get a single event", async () => {
    const refs = { refs: [{ id: "master", ref: "ref1" }] };

    const expectedId = "event_id";
    const prismaEvent = {
      _meta: {
        uid: expectedId
      },
      title: "title",
      start: "start",
      end: "end",
      location: "location",
      description: "description",
      ical: {
        url: "url",
        __typename: "_ExternalLink"
      }
    };

    const refsCalls: { method?: string; bearer?: string }[] = [];
    serversToCloseAfterEachTest.push(
      await testServer(
        refsCalls,
        req => ({ method: req.method, auth: req.headers["authorization"] }),
        [JSON.stringify(refs)],
        3001
      )
    );

    const eventsCalls: unknown[] = [];
    serversToCloseAfterEachTest.push(
      await testServer(
        eventsCalls,
        req => ({
          method: req.method,
          url: req.url,
          auth: req.headers["authorization"]
        }),
        [
          introspectionQueryResult,
          JSON.stringify({ data: { event: prismaEvent } })
        ],
        3002
      )
    );

    jest.resetModules();
    const server: Server = await require("./index").server;

    serversToCloseAfterEachTest.push(server);

    const res = await client.query({
      query: gql`{ event(id: "${expectedId}") { id title start end location description ical } }`
    });

    expect(res.data.event).toMatchObject({
      description: "description",
      end: "end",
      ical: "url",
      id: expectedId,
      location: "location",
      start: "start",
      title: "title"
    });
    expect(refsCalls).toEqual([
      {
        auth: "Token PRISMIC_ACCESS_TOKEN",
        method: "GET"
      },
      {
        auth: "Token PRISMIC_ACCESS_TOKEN",
        method: "GET"
      }
    ]);
    expect(eventsCalls.length).toBe(2);
    expect(eventsCalls).toMatchObject([
      {
        method: "GET",
        auth: "Token PRISMIC_ACCESS_TOKEN"
      },
      {
        method: "GET",
        auth: "Token PRISMIC_ACCESS_TOKEN"
      }
    ]);
  });
});
