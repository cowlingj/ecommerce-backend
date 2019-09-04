var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {
	map: {
		name: 'email'
	}
});

User.add({
	link: { type: Types.Text, label: ' ', hidden: true, default: 'edit', noedit: true,  },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	roles: { type: Types.Relationship, ref: 'Role', many: true }
});

User.schema.virtual('canAccessKeystone').get(function () {
	return true
});

User.defaultColumns = 'link, email|70%';
User.register();
