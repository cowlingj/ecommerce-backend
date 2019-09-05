const keystone = require('keystone');
const User = keystone.list('User');
const Role = keystone.list('Role');

const admins = [
	{ email: 'admin@test.com', password: 'admin' }
]

async function createAdminRole() {
	return await new Role.model({ name: 'admin' }).save()
}

async function createAdmin(admin, role) {
	return new User.model(Object.assign(admin, { roles: [ role ] })).save()
}

module.exports = function (done) {
	createAdminRole()
		.then((role) => {
			console.log('role created')
			return role
		})
		.then((role) => Promise.all(admins.map(async adminDetails => {
			const admin = await createAdmin(adminDetails, role);
			console.log('created admin');
			return admin;
		})))
		.then(() => {
			console.log('all admins created')
			done()
		})
		.catch(done)
}


