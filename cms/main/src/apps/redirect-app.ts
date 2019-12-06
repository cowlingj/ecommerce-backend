import express from 'express'
import { Keystone } from "@keystonejs/keystone";

interface Route {
  path: string,
  redirect: string
}

export default class {

  _routes: Route[]

  constructor({ routes }: { routes: Route[] }) {
    this._routes = routes
  }

  prepareMiddleware(_keystone: Keystone) {
    const app = express();

    this._routes.forEach(({ path, redirect }) => {
      app.use(path, (_req, res) => res.redirect(redirect))
    });

    return app;
  }

  build(){}
}
