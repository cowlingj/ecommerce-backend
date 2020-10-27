import 'source-map-support/register';
import serverless from 'serverless-http';
import createApp from './app';

const asyncHandler = createApp().then(serverless)

export default async (event, ctx) => ((await asyncHandler)(event, ctx))