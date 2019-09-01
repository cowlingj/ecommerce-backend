import request from "request-promise-native"

(async () => {

  console.log("initialising cms")

  try {

    const install = await request({
      method: 'GET',
      uri: 'http://cms/install',
      resolveWithFullResponse: true
    })

    console.log("made request")
    console.log(JSON.stringify(install.body, null, 2))
  
    if (install.statusCode > 400) {
      process.exit(1)
    }
  
    if (install.statusCode > 300) {
      process.exit(0)
    }
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
  
})()
