import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'izettle-serverless',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    stage: '${opt:stage, self:provider.stage, "dev"}'
  },
  plugins: [
    'serverless-webpack'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    all: {
      handler: 'src/handler.default',
      environment: {
        IZETTLE_AUTH_URI: 'https://oauth.izettle.com/token',
        IZETTLE_PRODUCTS_URI: 'https://products.izettle.com',
        IZETTLE_API_KEY: '${ssm:/izettle_api_key~true}'
      },
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/',
          }
        },
        {
          httpApi: {
            method: 'POST',
            path: '/',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
