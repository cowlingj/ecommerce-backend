import dotenv from 'dotenv'
dotenv.config()

import createApp from './app'

createApp()
  .then((app) => {
      app.listen(3000)
  })
  .catch((e) => {
      console.log(e)
  })