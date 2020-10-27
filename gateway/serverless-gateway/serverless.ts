import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'gateway-serverless',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      // FIXME: how can I parameterise this?
      PRODUCTS_URI: 'https://q33la3byi8.execute-api.us-east-1.amazonaws.com/dev/',
      EVENTS_URI: 'https://ayd2j8gf8l.execute-api.us-east-1.amazonaws.com/dev/'
    },
  },
  functions: {
    hello: {
      handler: 'handler.default',
      events: [
        {
          http: {
            method: 'GET',
            path: '/',
          }
        },
        {
          http: {
            method: 'POST',
            path: '/',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
