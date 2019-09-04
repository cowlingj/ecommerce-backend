const keystone = require('keystone')
const Types = keystone.Field.Types
const uuidv4 = require('uuid/v4')

const AuthCode = new keystone.List('AuthCode', {
  nocreate: true,
  nodelete: true,
})

AuthCode.add({
  name: {
    type: Types.Text,
    hidden: true,
    watch: true,
    value: function() {
      return this.key + " (" + this.value + ")" 
    }
  },
  key: { type: Types.Text, noedit: true, },
  value: { type: Types.Text, noedit: true, },
  enabled: { type: Types.Boolean, default: true, required: true, },
})

AuthCode.schema.pre('save', function(next){
  
  if (!this.key) { throw Error('no key') }
  if (!this.value) { this.value = uuidv4() }
  if (this.enabled !== false) { this.enabled = true }

  return next()
})

AuthCode.defaultColumns = 'name, value, enabled'

AuthCode.register()