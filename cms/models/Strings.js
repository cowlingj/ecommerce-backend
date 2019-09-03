var keystone = require('keystone');
var Types = keystone.Field.Types;

var StoreString = keystone.List('String')

StoreString.add({
  name: { type: Types.Key, required: true, initial: true, unique: true },
  value: { type: Types.Text, required: true, initial: true, unique: true },
})

StoreString.defaultColumns = 'name, value'

StoreString.register()