import { Keystone } from "@keystonejs/keystone"
import { logger } from "@keystonejs/logger"
import fs from 'fs'

type InitialStringsData = {
  strings: [
    {
      key: string,
      value: string
    }
  ]
}

export default async function createInitialUsersIfNotExisting(
  keystone: Keystone
) {

  const stringsFile = await Promise.resolve(process.env.STRINGS_FILE)
  if (stringsFile === undefined || !process.env.FLAG_RESOURCES) {
    return
  }

  const initialStringsData: InitialStringsData = await new Promise((resolve, reject) => {
    fs.readFile(stringsFile, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })

  const currentStringValueKeys: String[] = (
    await keystone.executeQuery(
      `query ($where: StringValueWhereInput!) {
         allStringValues(where: $where) {
           key
         }
      }`,
      {
        variables: {
          where: {
            key_in: initialStringsData.strings.map(
              initialString => initialString.key
            )
          }
        },
        context: {}
      }
    )
  ).data.allStringValues.map((string: { key: String }) => string.key);

  const stringsToCreate = initialStringsData.strings
    .filter(initialUser => !currentStringValueKeys.includes(initialUser.key))
    .map(string => ({ data: string }));

  logger("default").info(`creating ${stringsToCreate.length} new string(s)`)

  await keystone.executeQuery(
    `mutation ($create: [StringValuesCreateInput!]!) {
      createStringValues(data: $create) { id }
    }`,
    {
      variables: {
        create: stringsToCreate
      },
      context: {}
    }
  );
}
