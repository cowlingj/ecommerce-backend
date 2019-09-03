import request from "request-promise-native"

// test('cms install succeds', async () => {
//   const res = await request({
//     methid: 'GET',
//     uri: 'http://cms/install',
//     resolveWithFullResponse: true,
//   })
//   expect(res.statusCode).toBe(200)
//   expect(res.body).not.toMatch(/fatal\s+error/i)
// })

test('cms cannot login as admin', async () => {
  const res = await request({
    methid: 'POST',
    uri: 'http://cms/auth/check',
    resolveWithFullResponse: true,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ auth: { user: "admin", password: "admin" } })
  })

  expect(res.statusCode).toBe(200)
  expect(JSON.parse(res.body).success).toBe(false)
})

test('cms get strings succeds', async () => {
  const res = await request({
    methid: 'GET',
    uri: 'http://cms/api/collections/get/strings/',
    resolveWithFullResponse: true,
  })
  expect(res.statusCode).toBe(200)
  expect(res.body).toMatch('whatever the json should be')
})

