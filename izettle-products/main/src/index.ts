import { ApolloServer } from 'apollo-server'
import dotenv from 'dotenv'
import typeDefs from '@/schema.gql'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import oauth2 from 'simple-oauth2'

if (
  process.env.IZETTLE_AUTH_URI === undefined
  || process.env.IZETTLE_PRODUCTS_URI === undefined
  || process.env.IZETTLE_CREDENTIALS_FILE === undefined
  || process.env.SECRETS_DIR === undefined
) {
  throw new Error('environment variables not set up')
}

dotenv.config()

const credentials: {
  'username': string;
  'password': string;
  'client_id': string;
  'client_secret': string;
} = JSON.parse(fs.readFileSync(
  path.resolve(
    process.env.SECRETS_DIR,
    process.env.IZETTLE_CREDENTIALS_FILE
  ),
  'utf8'
))

const oauth2Client = oauth2.create({
  client: {
    id: credentials.client_id,
    secret: credentials.client_secret
  },
  auth: {
    tokenHost: process.env.IZETTLE_AUTH_URI,
    tokenPath: '/token'
  },
  options: {
    bodyFormat: 'json',
    authorizationMethod: 'body'
  }
})

const resolvers = {
  Query: {
    allProducts: async (): Promise<never[]> => {

      const token = oauth2Client.accessToken.create(
        await oauth2Client.ownerPassword.getToken({
          username: credentials.username,
          password: credentials.password,
          scope: ''
        })
      ).token['access_token']


      const res = await fetch(
        `${process.env.IZETTLE_PRODUCTS_URI}/organizations/self/products/v2/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      if (!res.ok) {
        throw new Error(`get all products failed (status: ${res.status})`)
      }
      return (await res.json()).data.map((izettleProduct: { uuid: string; name: string}) => {
        return {
          id: izettleProduct.uuid,
          name: izettleProduct.name
        };
      })
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers, playground: process.env.NODE_ENV === 'development' });

server.listen({
  port: parseInt(process.env.PORT ?? '') || 80,
  host: process.env.HOST ?? "0.0.0.0"
}).then(({ url }: { url: string }) => {
  console.log(`Server ready at ${url}`);
});

export default server;