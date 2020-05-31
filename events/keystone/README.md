# Keystone Events

Events service that forwards requests to the keystonejs CMS within the cluster

## Images

- [main](https://hub.docker.com/repository/docker/cowlingj/keystone-events.backend)

### Prerequisites

running locally:
- [node](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- A running [ecommerce-backend CMS](../../cms/keystone)

This project can also be run using [docker](https://www.docker.com) or [helm](https://helm.sh)

### Installation

```sh
cd app/
npm install
```

### Usage

```sh
npm run build
npm run start
```

OR

```sh
npm run dev
```

The above commands start the server in production or developement mode respectfully

## Documentation

More information about the app and helm chart can be found [here](./docs/)