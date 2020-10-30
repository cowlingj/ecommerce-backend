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
      minimumCompressionSize: 1024,
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
