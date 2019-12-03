import { Keystone } from "@keystonejs/keystone";
import fs from 'fs'

export default async function createInitialUsersIfNotExisting(
  keystone: Keystone
) {

  if (process.env.USERS_FILE === undefined && process.env.USERS === undefined) {
    return
  }

  type InitialUersData = {
    users: [
      {
        username: string,
        password: string,
        isAdmin: boolean
      }
    ]
  }

  const initialUsersData: InitialUersData = await new Promise((resolve, reject) => {
    if (process.env.USERS !== undefined) { // process.env.USERS is depricated
      resolve(JSON.parse(process.env.USERS))
    } else {
      fs.readFile(process.env.USERS_FILE!, "utf8", (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(data))
        }
      })
    }
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

  console.log(usersToCreate)

  await keystone.executeQuery(
    `mutation ($create: [UsersCreateInput!]!) {
      createUsers(data: $create) {
        username
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
