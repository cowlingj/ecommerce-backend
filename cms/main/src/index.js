import keystone from 'keystone'
import express from 'express'
import dotenv from 'dotenv'
import routes from './routes'
import api from './api'

async function init() {

	dotenv.config()

	// TODO: construct uri
	// let uri = `mongodb://${proces.env.MONGODB_USERNAME}`
	//	+ `:${proces.env.MONGODB_PASSWORD}`
	//	+ `@${proces.env.MONGODB_SERVICE_HOST}`
	//	+ `:${proces.env.MONGODB_SERVICE_PORT}`
	//	+`/${proces.env.MONGODB_DB}`

	console.log(encodeURI(process.env.MONGO_URI || 'mongodb://localhost:27017'))

	keystone.init({
		'name': 'Uni Cycle',
		'brand': 'Uni Cycle',
		'port': parseInt(process.env.ADMIN_PORT) || 80,
		'host': process.env.IP || '0.0.0.0',
		'mongo': encodeURI(process.env.MONGO_URI || 'mongodb://localhost:27017'),
		'cookie secret': process.env.COOKIE_SECRET,
		'module root': __dirname,

		'static': 'public',
		'favicon': 'public/assets/favicon.ico',

		'auto update': true,
		'session': false,
		'auth': true,
		'user model': 'User',
		'admin path': 'cms/admin'
	})

	keystone.import('models')

	keystone.set('routes', routes);

	keystone.set('nav', {
		'Users': [ 'User' ],
		'Resources': [ 'String', /*'Upload'*/ ],
		'Events': [ 'Event' ]
	})

	await new Promise((resolve, reject) => {
		try {
		keystone.start(() => {
			console.log('keystone endpoint available')
			resolve()
		})
		} catch (e) {
			console.error(e)
			reject
		}
	})

	let apiServer
	await new Promise((resolve, reject) => {
		try {
			const app = express();
			
			api(app);

			apiServer = app.listen(
				{
					port: parseInt(process.env.API_PORT) || 8080,
					host: process.env.IP || '0.0.0.0',
				},
				() => {
					console.log(`api endpoint available`)
					resolve()
				}
			)
		} catch (e) {
			console.error(e),
			reject()
		}
	})

	return {
		api: apiServer,
		admin: keystone.httpServer
	}
}

export default (() => {
	if (require.main === module) {
		return init()
	} else {
		return init
	}
})()