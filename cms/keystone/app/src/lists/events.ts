import { Text, Url, DateTime } from "@keystonejs/fields";
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
      description: {
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
    // access: {
    //   create: ({ authentication: { item: user } }) =>
    //     Boolean(user && user.isAdmin),
    //   read: true,
    //   update: ({ authentication: { item: user } }) =>
    //     Boolean(user && user.isAdmin),
    //   delete: ({ authentication: { item: user } }) =>
    //     Boolean(user && user.isAdmin)
    // }
  });
}
