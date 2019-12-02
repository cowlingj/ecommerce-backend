import { Text, Url, DateTime, Wysiwyg } from "@keystonejs/fields";
import { Keystone } from "@keystonejs/keystone";

export default function(keystone: Keystone) {
  keystone.createList("Event", {
    fields: {
      start: {
        type: DateTime
      },
      end: {
        type: DateTime
      },
      title: {
        type: Text,
      },
      decription: {
          type: Text,
          isMultiline: true
      },
      location: {
        type: Text
      },
      ical: {
        type: Url
      }
    },
    labelResolver: (item) => `${item.title} (${item.start} - ${item.end})`,
    access: ({ authentication: { item: user }, operation: operation }) =>
      Boolean(operation == "auth" || (user && user.isAdmin))
  });
}
