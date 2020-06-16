# apollo-basket

> This documentation is generated automatically do not edit by hand

app version: 0.0.1
node version: 14.3.0

Provides basket functionality to users of the store

## Running the App

The scripts available to run the application (using `npm run-script`),
including [lifecycle scripts](https://docs.npmjs.com/misc/scripts) are:

  - dev: `nodemon`
  - build: `webpack`
  - start: `node dist/index.js`
  - lint: `eslint *.ts src/**.ts`
  - test: `npm run-script test:unit ; npm run-script test:integration`
  - test:unit: `jest --passWithNoTests --config test/jest.unit.config.json`
  - test:integration: `jest --config test/jest.integration.config.json`
  - tsc: `tsc`

## Environment Variables

Environment variables can be set with the use of the `dotenv` package for development only.
Copy the included `.env.sample` to `.env` to configure the application using those environment variables.
Detail on the environment variables is as follows:

| Name | Default | Description |
| - | - | - |
| HOST | "localhost" | host to bind to (can be an IP address or 'localhost') |
| NODE_ENV | "production" | whether or not o deploy the application in 'production' or 'development mode' |
| PORT | "80" | port to bind to |
