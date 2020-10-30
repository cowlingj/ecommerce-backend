import dotenv from 'dotenv'
dotenv.config()

import createApp from './app'

createApp().listen(3000)