// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

var keystone = require('keystone');

var express = require('express');

keystone.init({
	'name': 'Uni Cycle',
	'brand': 'Uni Cycle',
	'port': 80,

	'static': 'public',
	'favicon': 'public/assets/favicon.ico',

	'auto update': true,
	'session': false,
	'auth': true,
	'user model': 'User',
	'admin path': '/cms/admin'
})

keystone.import('models')

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'Users': [ 'User' ],
	'Resources': [ 'String', /*'Upload'*/ ],
})

keystone.start();

const app = express();

require('./api')(app);

app.listen(8080, () => console.log(`api endpoint available`))