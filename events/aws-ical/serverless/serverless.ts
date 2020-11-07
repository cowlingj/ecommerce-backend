import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'aws-ical-serverless',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    stage: '${opt:stage, self.provider.stage, "dev"}'
  },
  plugins: [
    'serverless-webpack',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      restApiId: '${cf:ecommerce-backend-shared-${self:custom.stage}.ApiGatewayRestApiId}',
      restApiRootResourceId: '${cf:ecommerce-backend-shared-${self:custom.stage}.ApiGatewayRestApiRootResourceId}'
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: [
        's3:ListBucket',
        's3:GetObject'
      ],
      Resource: [
        {
          "Fn::GetAtt" : [ "icsBucket", "Arn" ]
        },
        {
          'Fn::Join': [
            '',
            [
              { "Fn::GetAtt" : [ "icsBucket", "Arn" ] },
              '/*'
            ]
          ]
        }
      ]
    }]
  },
  functions: {
    all: {
      handler: 'handler.default',
      environment: {
        BUCKET: { "Ref" : "icsBucket" }
      },
      events: [
        {
          http: {
            method: 'GET',
            path: '/events',
            authorizer: {
              type: 'aws_iam'
            }
          }
        },
        {
          http: {
            method: 'POST',
            path: '/events',
            authorizer: {
              type: 'aws_iam'
            }
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      icsBucket: {
        "Type" : "AWS::S3::Bucket",
	      "DeletionPolicy": "Retain",
        "Properties" : {}
      }
    },
    Outputs: {
      icsBucketName: {
        Value: { "Ref" : "icsBucket" }
      }
    }
  }
}

module.exports = serverlessConfiguration;
