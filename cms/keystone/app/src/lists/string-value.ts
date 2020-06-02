import { Text } from "@keystonejs/fields";
import { Keystone } from "@keystonejs/keystone";

export default function(keystone: Keystone) {
  keystone.createList("StringValue", {
    label: 'Text',
    plural: 'Texts',
    labelField: 'key',
    fields: {
      key: {
        type: Text,
        isRequired: true,
        isUnique: true
      },
      value: {
        label: 'Content',
        type: Text,
        isMultiline: true
      }
    },
    access: {
      create: ({ authentication: { item: user } }) =>
        Boolean(user && user.isAdmin),
      read: true,
      update: ({ authentication: { item: user } }) =>
        Boolean(user && user.isAdmin),
      delete: ({ authentication: { item: user } }) =>
        Boolean(user && user.isAdmin)
    }
  });
}
