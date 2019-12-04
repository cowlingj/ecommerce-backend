import { Text, Checkbox, Password } from '@keystonejs/fields'
import { Keystone } from '@keystonejs/keystone'

export default function(keystone: Keystone) {
    keystone.createList('User', {
        fields: {
            username: {
                type: Text,
                isUnique: true,
            },
            isAdmin: { type: Checkbox },
            password: {
                type: Password,
            },
        },
        access: ({ authentication: { item: user }, operation: operation }) =>
          Boolean(operation === 'auth' || user && user.isAdmin)
  })
}
