import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import schema from "@/schema.gql";
import products from "@/product.gql";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import form from "form-urlencoded";

if (
  process.env.IZETTLE_AUTH_URI === undefined ||
  process.env.IZETTLE_PRODUCTS_URI === undefined ||
  process.env.IZETTLE_CREDENTIALS_FILE === undefined ||
  process.env.SECRETS_DIR === undefined
) {
  throw new Error("environment variables not set up");
}

dotenv.config();

const credentials: {
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
} = JSON.parse(
  fs.readFileSync(
    path.resolve(process.env.SECRETS_DIR, process.env.IZETTLE_CREDENTIALS_FILE),
    "utf8"
  )
);

const resolvers = {
  Query: {
    allProducts: async (): Promise<
      {
        id: string;
        name: string;
      }[]
    > => {
      let token: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };

      try {
        const res = await fetch(`${process.env.IZETTLE_AUTH_URI}/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
          },
          /* eslint-disable @typescript-eslint/camelcase */
          body: form({
            client_id: credentials.client_id,
            client_secret: credentials.client_secret,
            username: credentials.username,
            password: credentials.password,
            grant_type: "password"
          })
          /* eslint-enable @typescript-eslint/camelcase */
        });

        const json = await res.json();
        token = {
          accessToken: json.access_token,
          refreshToken: json.refresh_token,
          expiresIn: json.expires_in
        };
      } catch (err) {
        console.log(`error getting oauth token ${err}`);
        throw err;
      }

      const res = await fetch(
        `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/v2/`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        }
      );
      if (!res.ok) {
        throw new Error(`get all products failed (status: ${res.status})`);
      }
      return (await res.json()).data.map(
        (izettleProduct: { uuid: string; name: string }) => {
          return {
            id: izettleProduct.uuid,
            name: izettleProduct.name
          };
        }
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: [schema, products],
  resolvers,
  playground: process.env.NODE_ENV === "development"
});

server
  .listen({
    port: parseInt(process.env.PORT ?? "") || 80,
    host: process.env.HOST ?? "0.0.0.0",
    formatError: (err: Error) => {
      console.log(err);
      return { err };
    }
  })
  .then(({ url }: { url: string }) => {
    console.log(`Server ready at ${url}`);
  });

export default server;
