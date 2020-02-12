import { keystone, apps } from '../src/index'
import { getIntrospectionQuery, buildSchema } from 'graphql'
import { writeFileSync } from 'fs';
import { resolve } from 'path';

(async function () {
  try {
    await keystone.prepare({ dev: true, apps });
    await keystone.disconnect()

    const { errors, data } = await keystone.executeQuery(
      getIntrospectionQuery(),
      { variables: {}, context: {}}
    )

    if (errors) {
      throw new Error(errors)
    }

    const schema = `module.exports = ${
      JSON.stringify(data)
    }`

    writeFileSync(resolve(process.cwd(), 'cms-api-template', 'index.js'), schema)

    // FIXME: process must be terminated manually,
    // this is apparently due of a filewatcher somewhere
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
