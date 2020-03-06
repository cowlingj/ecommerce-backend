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

  it("Can get a list of events", async () => {
    const keystoneEvents = [
      {
        id: "id-0",
        title: "title-0",
        start: "start-0",
        end: "end-0",
        location: "location-0",
        description: "description-0",
        ical: "ical-0"
      },
      {
        id: "id-1",
        title: "title-1",
        start: "start-1",
        end: "end-1",
        location: "location-1",
        description: "description-1",
        ical: "ical-1"
      }
    ];

    const eventsCalls: {
      method: string;
      auth: string;
    }[] = [];

    serversToCloseAfterEachTest.push(
      await testServer(
        eventsCalls,
        () => null,
        [
          introspectionQueryResult,
          JSON.stringify({ data: { allEvents: keystoneEvents } })
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
    expect(eventsCalls.length).toBe(2);
  });

  it("Can get a single event", async () => {
    const expectedId = "event_id";

    const keystoneEvent = {
      id: expectedId,
      title: "title-0",
      start: "start-0",
      end: "end-0",
      location: "location-0",
      description: "description-0",
      ical: "ical-0"
    };

    const eventsCalls: {
      method: string;
      auth: string;
    }[] = [];

    serversToCloseAfterEachTest.push(
      await testServer(
        eventsCalls,
        () => null,
        [
          introspectionQueryResult,
          JSON.stringify({ data: { Event: keystoneEvent } })
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
          event(id: "${expectedId}") {
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

    expect(res.data.event).toMatchObject({
      description: "description-0",
      end: "end-0",
      ical: "ical-0",
      id: expectedId,
      location: "location-0",
      start: "start-0",
      title: "title-0"
    });
    expect(eventsCalls.length).toBe(2);
  });
});
