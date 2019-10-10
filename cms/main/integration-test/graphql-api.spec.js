import ApolloClient, { gql } from 'apollo-boost'
import fetch from 'node-fetch'
import { expect } from 'chai'
import MongoMemoryServer from 'mongodb-memory-server'
import path from 'path'
import { config } from 'dotenv'

describe("graphql api", () => {

  let client
  let mongodServer
  let apiServer
  let adminServer

  before(async function () {

    config({
      path: path.join(__dirname, '.env')
    })

    mongodServer = new MongoMemoryServer({
      instance: {
        port: 8082,
        ip: '127.0.0.1',
        dbName: 'cms',
        // auth: true
      }
    })

    process.env.MONGO_URI = await mongodServer.getConnectionString();

    console.log(`mongo: ${process.env.MONGO_URI}`)

    client = new ApolloClient({
      uri: `http://${process.env.IP}:${process.env.API_PORT}/graphql`,
      fetch
    })

    process.env.ADMIN_PORT = '8080'

    const servers = await require('../src/index').default()
    adminServer = servers.admin
    apiServer = servers.api
  })

  after(async function () {
    console.warn('shutting down keystone may take up to a minute...')
    await mongodServer.stop()
    await new Promise((resolve, reject) => apiServer.close((err) => err ? reject() : resolve()))
    await new Promise((resolve, reject) => adminServer.close((err) => err ? reject() : resolve()))
  })

  it("has at least 1 admin user", async function () {
    const query = await client.query({
      query: gql`{ users { id } }`
    })
    expect(query.data.users.length).to.be.at.least(1)
  })
  
  it('has a list of strings', async function () {
    await client.query({
      query: gql`{ strings { name, value } }`
    })
  })

  it('has a list of events', async function () {
    await client.query({
      query: gql`{ events { id, title, description } }`
    })
  })
})



