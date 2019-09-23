var graphql = require('./graphql')

module.exports = (app) => {
  graphql.default(app)
  app.all('*', (_req, res) => { res.sendStatus(404) })
	app.use((_err, _req, res, _next) => { res.sendStatus(500) })
}