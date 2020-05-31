# Prismic Events

Events service utilising [Prismic](https://prismic.io/) as the storage backend

## Images

- [main](https://hub.docker.com/repository/docker/cowlingj/prismic-events.backend)

### Prerequisites

running locally:
- [node](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

This project can also be run using [docker](https://www.docker.com) or [helm](https://helm.sh)

### Installation

#### Dependencies

```sh
cd app/
npm install
```

#### Prismic Setup

1. Create a repository
2. Create a new custom type with app id of ${PRISMIC_EVENT_TYPE}
  - In the json tab paste `prismic-event.json` (this sets up the event with the correct variables)

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
