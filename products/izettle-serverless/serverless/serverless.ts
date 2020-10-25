import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'serverless',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
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
      handler: 'src/index.default',
      environment: {
        IZETTLE_AUTH_URI: 'https://oauth.izettle.com/token',
        IZETTLE_PRODUCTS_URI: 'https://products.izettle.com',
        IZETTLE_API_KEY: '${ssm:/izettle_api_key~true}'
      },
      events: [
        {
          http: {
            method: 'get',
            path: '/',
          }
        },
        {
          http: {
            method: 'get',
            path: '/{any+}',
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
