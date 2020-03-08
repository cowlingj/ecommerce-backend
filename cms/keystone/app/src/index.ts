import { Keystone } from "@keystonejs/keystone";
import { PasswordAuthStrategy } from "@keystonejs/auth-password";
import { GraphQLApp } from "@keystonejs/app-graphql";
import { AdminUIApp } from "@keystonejs/app-admin-ui";
import { MongooseAdapter } from "@keystonejs/adapter-mongoose";
import setupLists from "./lists";
import onConnect from "./on-connect";
import { config } from "dotenv";
import path from "path";
import RedirectApp from './apps/redirect-app'

if (process.env.NODE_ENV === "development") {
  config({ path: path.resolve(process.cwd(), "config", ".env") });
}


const mongoUri = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?${process.env.DB_QUERY_STRING}`;


const keystone = new Keystone({
  name: "Uni-Cycle",
  adapter: new MongooseAdapter({ mongoUri }),
  secureCookies: false,
  queryLimits: {
    maxTotalResults: 100
  },
  onConnect() {
    onConnect(keystone);
  }
});

setupLists(keystone);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
  config: {
    identityField: "username",
    secretField: "password"
  }
});

export { keystone }

const basePath = `/${process.env.BASE_PATH ?? ""}`
const apiPath = path.join(basePath, "/graphql")
const graphiqlPath = path.join(basePath, "/playground")
const adminPath = path.join(basePath, "/admin")

export const apps = [
    new GraphQLApp({
      apiPath,
      graphiqlPath
    }),
    new AdminUIApp({
      adminPath,
      apiPath,
      graphiqlPath,
      enableDefaultRoute: false,
      isAccessAllowed: ({ authentication: { item: user } }) =>
        Boolean(user && user.isAdmin),
      authStrategy
    }),
    new RedirectApp({
      routes: [
        { path: basePath, redirect: adminPath },
      ]
    })
  ]
