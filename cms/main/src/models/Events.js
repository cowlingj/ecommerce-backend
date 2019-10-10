var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = keystone.List('Event')

Event.add({
  title: { type: Types.Key, required: false, initial: true, unique: false },
  description: { type: Types.Text, required: false, initial: true, unique: false },
})

Event.defaultColumns = 'title'

Event.register()