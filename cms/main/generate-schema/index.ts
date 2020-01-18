import { keystone, apps } from '../src/index'
import { getIntrospectionQuery, buildClientSchema, printSchema } from 'graphql'

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

    console.log(printSchema(buildClientSchema(data)))

    // FIXME: process must be terminated manually,
    // this is apparently due of a filewatcher somewhere
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
