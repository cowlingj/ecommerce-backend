# CMS

A headless cms built with [keystonejs](https://keystonejs.com)

## Getting Started

### Prerequisites

- In order to run the app locally you will need [node](https://nodejs.org) and [npm](https://www.npmjs.com/) installed.
- There is also a `Dockerfile` to install using [docker](https://www.docker.com).
- [Mongodb](https://www.mongodb.com/) needs to be running and available for the cms to store data.
- Integration tests use [kubectl](https://kubernetes.io/) and [helm](https://helm.sh/)

### Installation

with `npm`:
```sh
npm i [--production]
```

with `docker`:
```sh
docker build [--tag <TAG_NAME>] .
```

### Usage

with `npm`:
```sh
npm run start
```

There is also a `dev` script that will detect changes and reload (package needs to be installed without `--production` flag).

with `docker`:
```sh
docker run docker run --expose 3000 -e COOKIE_SECRET=<MY_COOKIE_SECRET> -P <TAG_NAME>
```

The admin UI is available bu default at `http://localhost:3000/`.
A graphql endpoint is exposed at `http://localhost:3000/graphql`,
in development mode the playground is also available here.

> Note: the graphql endpoint needs authorization in the form of a jwt [TODO]

### Configuration

#### Common Options

- `NODE_ENV=development` makes the playground available and makes keystone run in development mode.
- `COOKIE_SECRET=<MY_RANDOMLY_GENERATED_SECRET>` is used by keystone to encrypt cookies.
- `MONGO_URI=mongodb://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>` is used by keystone to connect to mongodb.

Other configuration options can be found on the [keystonejs](https://keystonejs.com/documentation/configuration) website

### Tests

Tests to make sure the cms correctly interacts with other services can be found under `/integration-test`.
These tests can be run with the test.sh script, or manually, by deploying the helm charts under deploy then deploying the runner in the foreground with `kubectl`.

Integration test runner runs on node and uses the [jest](https://jestjs.io/) library. 
