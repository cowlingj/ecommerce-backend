import { Text, Url, Integer } from "@keystonejs/fields";
import { Keystone } from "@keystonejs/keystone";

export default function(keystone: Keystone) {
  keystone.createList("Product", {
    fields: {
      name: {
        type: Text
      },
      imageUrl: {
        type: Url
      },
      price: {
        type: Integer
      },
      currency: {
        type: Text
      }
    },
    labelResolver: (item) => item.name,
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
  keystone.createList("Product", {
    fields: {
      name: {
        type: Text
      },
      imageUrl: {
        type: Url
      },
      price: {
        type: Integer
      },
      currency: {
        type: Text
      }
    }
  });
}
