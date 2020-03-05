import fetch from "node-fetch";
import { HttpLink, ApolloLink } from "apollo-boost";
import { setContext } from "apollo-link-context";

export function createLink(): ApolloLink {
  const refLink = setContext(async (_, { headers }) => {
    if (
      process.env.PRISMIC_REFS_URI === undefined ||
      process.env.PRISMIC_ACCESS_TOKEN === undefined
    ) {
      throw new Error("environment variables not set up");
    }

    const refsRes = await fetch(process.env.PRISMIC_REFS_URI, {
      headers: {
        authorization: `Token ${process.env.PRISMIC_ACCESS_TOKEN}`
      }
    });

    if (!refsRes.ok) {
      throw new Error("could not authenticate with prismic");
    }

    const json: { refs: { id: string; ref: string }[] } = await refsRes.json();
    const ref = json.refs.filter(ref => ref.id === "master")[0]?.ref;

    return {
      headers: {
        ...headers,
        "Prismic-Ref": ref
      }
    };
  });

  const httpLink = new HttpLink({
    headers: {
      authorization: `Token ${process.env.PRISMIC_ACCESS_TOKEN}`
    },
    uri: process.env.PRISMIC_GRAPHQL_URI,
    fetch: (fetch as unknown) as (
      input: RequestInfo,
      init?: RequestInit | undefined
    ) => Promise<Response>,
    fetchOptions: {
      method: "GET"
    }
  });

  return refLink.concat(httpLink);
}
