var graphql = require('./graphql')

module.exports = (app) => {
  graphql.default(app)
	app.use((_err, _req, res, _next) => { res.sendStatus(500) })
}