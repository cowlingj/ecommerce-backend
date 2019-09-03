var graphql = require('./graphql')
var middleware = require('./middleware')
var keystone = require('keystone').middleware

exports = module.exports = function (app) {
	// TODO: middleware.requireUser / require Token
	graphql.default(app)

	app.get('/', (_req, res) => { res.redirect('/keystone') })
	app.all('*', (_req, res) => { res.sendStatus(404) })
	app.use((_err, _req, res, _next) => { res.sendStatus(500) })
}
