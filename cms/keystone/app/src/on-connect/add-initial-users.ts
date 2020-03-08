import { Keystone } from "@keystonejs/keystone"
import { logger } from "@keystonejs/logger"
import fs from 'fs'

type InitialUersData = {
  users: [
    {
      username: string,
      password: string,
      isAdmin: boolean
    }
  ]
}

export default async function createInitialUsersIfNotExisting(
  keystone: Keystone
) {

  const usersFile = await Promise.resolve(process.env.USERS_FILE )
  if (usersFile === undefined) {
    return
  }

  const initialUsersData: InitialUersData = await new Promise((resolve, reject) => {
    fs.readFile(usersFile, "utf8", (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })

  const currentUsernames: String[] = (
    await keystone.executeQuery(
      `query ($where: UserWhereInput!) {
         allUsers(where: $where) {
           username
         }
      }`,
      {
        variables: {
          where: {
            username_in: initialUsersData.users.map(
              initialUser => initialUser.username
            )
          }
        },
        context: {}
      }
    )
  ).data.allUsers.map((user: { username: String }) => user.username);

  const usersToCreate = initialUsersData.users
    .filter(initialUser => !currentUsernames.includes(initialUser.username))
    .map(user => ({ data: user }));

  logger("default").info(`creating ${usersToCreate.length} new user(s)`)

  await keystone.executeQuery(
    `mutation ($create: [UsersCreateInput!]!) {
      createUsers(data: $create) {
        id
      }
    }`,
    {
      variables: {
        create: usersToCreate
      },
      context: {}
    }
  );
}
