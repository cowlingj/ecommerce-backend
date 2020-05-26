# CMS

[![Known Vulnerabilities](https://snyk.io/test/github/cowlingj/nuxt-ecommerce/badge.svg?targetFile=/cms/main/package.json)](https://snyk.io/test/github/cowlingj/nuxt-ecommerce)

A headless cms built with [keystonejs](https://keystonejs.com)

## Images

main: cowlingj/cms.admin:0.0.1

### Prerequisites

running locally:
- [node](https://nodejs.org)
- [npm](https://www.npmjs.com/)
- [Mongodb](https://www.mongodb.com/)

This project can also be run using [docker](https://www.docker.com) or [helm](https://helm.sh)

### Installation

local:
```sh
cd app/
npm install
```

### Usage

local:
```sh
cd app/
npm run build
npm run start
```

> There is also a `dev` script that will detect changes and reload.

The admin UI is available bu default at `http://<HOST>:3000/cms/admin`.
A graphql endpoint is exposed at `http://<HOST>:3000/cms/graphql`.

### Configuration

#### Common Options

| Name | Description |
|---|---|
| NODE_ENV | whether to run as development or production  |
| MONGO_URI[^1] | full `mongodb://...` connection string |
| DB_USERNAME[^1] | mongodb database username |
| DB_PASSWORD[^1] | mongodb database password |
| DB_HOST[^1] | mongodb database host |
| DB_PORT[^1] | mongodb database port |
| DB_NAME[^1] | mongodb database name|
| DB_QUERY_STRING[^1] | mongodb connection uri query parameters |
| FLAG_EVENTS | whether or not to store events |
| FLAG_PRODUCTS | whether or not to store products |
| FLAG_RESOURCES | whether or not to store resources |
| COOKIE_SECRET | secret key required for secure cookies |
| PORT | |
| IP | |
| BASE_PATH | |

[^1] Either MONGO_URI must be set or all of the DB_* variables must be set.

Other configuration options can be found on the [keystonejs](https://keystonejs.com/documentation/configuration) website.