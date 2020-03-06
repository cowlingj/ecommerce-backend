import fetch from "node-fetch";
import { HttpLink, ApolloLink } from "apollo-boost";

export function createLink(): ApolloLink {
  return new HttpLink({
    uri: process.env.KEYSTONE_URI,
    fetch: (fetch as unknown) as (
      input: RequestInfo,
      init?: RequestInit | undefined
    ) => Promise<Response>
  });
}
