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
    },
    stage: '${opt:stage, self.provider.stage, "dev"}'
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    role: '${cf:ecommerce-backend-shared-${self:custom.stage}.ApiGatewayInvokerLambdaRole}',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PRODUCTS_URI: '${cf:izettle-serverless-${self:custom.stage}.ServiceEndpoint}/products',
      EVENTS_URI: '${cf:aws-ical-serverless-${self:custom.stage}.ServiceEndpoint}/events',
      NODE_ENV: 'development' 
    },
  },
  functions: {
    all: {
      handler: 'handler.default',
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
