# json-product-service

> This documentation is generated automatically do not edit by hand

app version: 0.0.1
node version: 13.2.0

## Running the App

The scripts available to run the application (using `npm run-script`),
including [lifecycle scripts](https://docs.npmjs.com/misc/scripts) are:

  - test: `f() { npm run test:unit; npm run test:integration; }; f`
  - test:integration: `jest -c jest.integration.config.json`
  - test:unit: `jest -c jest.spec.config.json`
  - dev: `nodemon`
  - build: `webpack`
  - lint: `eslint --ext js,ts,json src`
  - start: `node dist/index.js`

## Environment Variables

Environment variables can be set with the use of the `dotenv` package for development only.
Copy the included `.env.sample` to `.env` to configure the application using those environment variables.
Detail on the environment variables is as follows:

| Name | Default | Description |
| - | - | - |
| HOST | "0.0.0.0" | host to bind to |
| NODE_ENV | | mode to run in (development|production) |
| PORT | | Port to listen on |
| PRODUCTS_FILE | | location for the JSON file containing products (this file is only read on startup, so changes won't take effect until restart) |
