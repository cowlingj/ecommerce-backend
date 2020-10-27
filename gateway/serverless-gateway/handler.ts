import 'source-map-support/register';
import serverless from 'serverless-http';
import createApp from './app';

export default createApp().then(serverless)