import createApp from './app'
import serverless from 'serverless-http'

export default serverless(createApp())