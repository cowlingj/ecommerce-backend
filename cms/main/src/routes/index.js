var keystone = require('keystone')

exports = module.exports = function (app) {
	app.get(['/', '/cms'], (_req, res) => { res.redirect(keystone.get('admin path')) })
	app.all('*', (_req, res) => { res.sendStatus(404) })
	app.use((_err, _req, res, _next) => { res.sendStatus(500) })
}
