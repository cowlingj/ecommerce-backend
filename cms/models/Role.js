const keystone = require('keystone')
const Types = keystone.Field.Types;

const Role = new keystone.List('Role')

Role.add({
  name: { type: Types.Key, unique: true, initial: true, index: true }
})

Role.defaultColumns = 'name'

Role.register()