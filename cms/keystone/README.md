# Keystone-CMS

A CMS for the backend built with [keystonejs](https://keystonejs.com).

## Images

- [main](https://hub.docker.com/repository/docker/cowlingj/keystone-cms.admin)
- [init](https://hub.docker.com/repository/docker/cowlingj/init-keystone-cms.admin)

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
npm run start
```

> There is also a `dev` script that will detect changes and reload.

The admin UI is available bu default at `http://<HOST>:3000/cms/admin`.
A graphql endpoint is exposed at `http://<HOST>:3000/cms/graphql`.

## Documentation

More information about the app and helm chart can be found [here](./docs/)