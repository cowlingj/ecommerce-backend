var keystone = require('keystone');
var Types = keystone.Field.Types;

var StringResource = keystone.List('String', {
  label: "Text"
})

StringResource.add({
  name: { type: Types.Key, required: true, initial: true, unique: true },
  value: { type: Types.Text, required: true, initial: true, unique: true },
})

StringResource.defaultColumns = 'name, value'

StringResource.register()