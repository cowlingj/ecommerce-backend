import "./load-config";
import { Keystone } from "@keystonejs/keystone";
import { GraphQLApp } from "@keystonejs/app-graphql";
import { AdminUIApp } from "@keystonejs/app-admin-ui";
import { MongooseAdapter } from "@keystonejs/adapter-mongoose";
import setupLists from "./lists";
import onConnect from "./on-connect";
import session from 'express-session'
import connectMongo from 'connect-mongo'
import express from 'express'
import { promisify } from 'util'
import http, { Server } from 'http'
import core from "express-serve-static-core"
import { apiPath, graphiqlPath, adminPath, basePath } from "./paths"
import { pseudoRandomBytes } from "crypto"


const port = parseInt(process.env.PORT ?? "") ?? 80
const host = process.env.HOST ?? "0.0.0.0"
const protocol = process.env.PROTOCOL ?? "http"

// a default mongoUri needs to be set
// (even at build time, issue: https://github.com/keystonejs/keystone/issues/2350)
const mongoUri = process.env.MONGO_URI ?? "mongodb://localhost:27017"

const MongoDBStore = connectMongo(session);

export let graphQLApp = new GraphQLApp({
  apiPath,
  graphiqlPath,
});

export let adminUIApp = new AdminUIApp({
  adminPath,
  apiPath,
  graphiqlPath,
  enableDefaultRoute: false
});

const cookieSecret = process.env.COOKIE_SECRET || pseudoRandomBytes(32).toString("hex")

export const keystone = new Keystone({
  name: "Uni-Cycle",
  adapter: new MongooseAdapter({ mongoUri }),
  secureCookies: false,
  cookieSecret,
  sessionStore: new MongoDBStore({
    url: mongoUri,
    collection: '_session'
  }),
  queryLimits: {
    maxTotalResults: 100
  },
  onConnect() {
    console.log("connected to database, running initialisation...")
    onConnect(keystone);
  }
});

export const distDir = `${__dirname}/assets`

export const apps = [graphQLApp, adminUIApp]

setupLists(keystone);

const dev = process.env.NODE_ENV === 'development'

export async function start() {

  const graphQLMiddleware = graphQLApp.prepareMiddleware({
    keystone, dev
  });

  // @ts-ignore
  const adminUIMiddleware = adminUIApp.prepareMiddleware({
    keystone, dev, distDir
  })

  await keystone.prepare({});

  const app = express();

  app.use(session({
    secret: cookieSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
  
  app.use([graphQLMiddleware as unknown as core.Express])
  app.use([adminUIMiddleware])

  app.use(basePath, (req, res) => { res.redirect(adminPath) });
  app.use((req, res) => { res.sendStatus(404) });

  const server = http.createServer(app);

  await promisify<number, string>(server.listen.bind(server))(port, host);

  console.log(`listening at http://${host}:${port}${basePath}`)
  
  await keystone.connect();
  return server
};
