# ecommerce-backend-cms

> This documentation is generated automatically do not edit by hand

app version: 5.0.0
node version: 13.2.0

A CMS powered by keystonejs

## Running the App

The scripts available to run the application (using `npm run-script`),
including [lifecycle scripts](https://docs.npmjs.com/misc/scripts) are:

  - dev: `scripts/dev.sh`
  - start: `scripts/build.sh &amp;&amp; scripts/start.sh`
  - tsc: `scripts/tsc.sh`
  - clean: `scripts/clean.sh`

## Environment Variables

Environment variables can be set with the use of the `dotenv` package for development only.
Copy the included `.env.sample` to `.env` to configure the application using those environment variables.
Detail on the environment variables is as follows:

| Name | Default | Description |
| - | - | - |
| BASE_PATH | "/cms" | base path for both the admin ui and api |
| COOKIE_SECRET | | secret used to encrypt admin session cookies |
| DB_HOST | | the host segment of the mongodb uri (when MONGO_URI is undefined)  |
| DB_NAME | | the database name segment of the mongodb uri (when MONGO_URI is undefined)  |
| DB_PASSWORD | | the password segment of the mongodb uri (when MONGO_URI is undefined)  |
| DB_PORT | | the port segment of the mongodb uri (when MONGO_URI is undefined)  |
| DB_QUERY_STRING | | the query sting segment of the mongodb uri (when MONGO_URI is undefined)  |
| DB_USERNAME | | the username segment of the mongodb uri (when MONGO_URI is undefined)  |
| FLAG_DISABLE_EVENTS | | define to remove event support from the CMS |
| FLAG_DISABLE_PRODUCTS | | define to remove products support from the CMS |
| FLAG_DISABLE_RESOURCES | | define to remove resources support from the CMS |
| MONGO_URI | "mongodb://localhost:27017" | URI of the running mongodb instance |
| PORT | "3000" | port to listen on |
| STRINGS_FILE | "./config/strings.json" | default string resources are created from this file |
| USERS_FILE | "./config/users.json" | default users are created from this file |
