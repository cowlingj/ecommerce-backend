import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'aws-ical-serverless',
  },
  frameworkVersion: '2',
  custom: {
    output: {
      file: 'build/out.json'
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: [
    'serverless-webpack',
    'serverless-stack-output'
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
      handler: 'handler.all',
      environment: {
        BUCKET: { "Ref" : "icsBucket" }
      },
      events: [
        {
          http: {
            method: 'get',
            path: '/all',
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
