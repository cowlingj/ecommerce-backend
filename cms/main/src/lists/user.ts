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
        access: (auth) => {
          console.log(JSON.stringify({
            msg: "accessing user",
            auth: auth
          }))
          return Boolean(true)
        }
  })
}
