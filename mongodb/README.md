# Mongodb

A mongodb cluster

## Images

main: docker.pkg.github.com/cowlingj/ecommerce-backend/mongodb.data:0.0.1

## Getting Started

Mongodb uses the [official dockerhub image](https://hub.docker.com/_/mongo)

There are multiple ways to run the project with docker, or with helm


### Prerequisites

docker:
- [Docker](https://www.docker.com/)

helm:
- [Helm](https://helm.sh)
- [Docker](https://www.docker.com/)

### Installation

docker:
```sh
docker build [-t <TAG_NAME>] ./main
```

helm:
```sh
docker build -t mongodb.backend.local:<Chart.AppVersion> ./main
helm install /chart
```

## Usage



### Configuration

All `*.js` and `*.sh` files in `/init-scripts` are read in alphanumerical order.
Add a new script to perform that action on startup.

`mongod.conf` options [here](https://docs.mongodb.com/manual/reference/configuration-options/)
