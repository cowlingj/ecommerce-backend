var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = keystone.List('Event')

Event.add({
  title: { type: Types.Text, required: true, initial: true, unique: false },
  description: { type: Types.Textarea, required: false, initial: true, unique: false },
})

Event.defaultColumns = 'title'

Event.register()