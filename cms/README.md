# CMS

[![Known Vulnerabilities](https://snyk.io/test/github/cowlingj/nuxt-ecommerce/badge.svg?targetFile=/cms/main/package.json)](https://snyk.io/test/github/cowlingj/nuxt-ecommerce)

A headless cms built with [keystonejs](https://keystonejs.com)

## Images

main: gcr.io/gke-test-253221/cms.admin:0.0.1

## Getting Started

The project is structured as follows:
```
/cms
|- /chart # location of helm chart
|- /integration-test # integration tests for cms
|- /main # app
```

There are multiple ways to run the project, locally, with docker, or with helm

### Prerequisites

local:
- [node](https://nodejs.org)
- [npm](https://www.npmjs.com/)
- [Mongodb](https://www.mongodb.com/)

docker:
- [docker](https://www.docker.com)
- [Mongodb](https://www.mongodb.com/) (there's also an official [docker image](https://hub.docker.com/_/mongo))

helm:
- [helm](https://helm.sh)
- [kubernetes](https://kubernetes.io/)
- [docker](https://www.docker.com)
- the mongodb chart and image (instructions for mongodb helm chart [here](../mongodb/README.md))

### Installation

local:
```sh
cd main/
npm i [--production]
```

docker:
```sh
docker build [--tag <TAG_NAME>] ./main
```

helm:
```sh
docker build -t cms.admin.local:<Chart.AppVersion> ./main
```

### Usage

local:
```sh
cd main
npm run start
```

There is also a `dev` script that will detect changes and reload (package needs to be installed without `--production` flag).

docker:
```sh
docker run docker run --expose 3000 -P <TAG_NAME>
```

helm:
make sure values.yaml is correct then:
```sh
helm install [--name <RELEASE_NAME>] ./chart
```

The admin UI is available bu default at `http://<HOST>:3000/`.
A graphql endpoint is exposed at `http://<HOST>:3000/graphql`,
in development mode the playground is also available here.

### Configuration

#### Common Options

- `NODE_ENV=development` makes the playground available and makes keystone run in development mode.
- `COOKIE_SECRET=<SECRET>` (required) is used by keystone to encrypt cookies.
- `MONGO_URI=mongodb://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>` (required) is used by keystone to connect to mongodb.

Other configuration options can be found on the [keystonejs](https://keystonejs.com/documentation/configuration) website.

> For local development [dotenv](https://www.npmjs.com/package/dotenv) is supported

### Tests

Integration tests check the expose graphql api (all of the admin UI is handled by keystone).
These tests can be run with the `test.sh` script (in the `/integration-test` directory), or manually by deploying the helm chart under then deploying the test runner in the foreground with `kubectl`.