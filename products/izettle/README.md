# Izettle Products

Products service that uses Izettle as a backend

## Images

- [main](https://hub.docker.com/repository/docker/cowlingj/izettle-products.backend)

### Prerequisites

running locally:
- [node](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- An [izettle](https://www.izettle.com/) account

This project can also be run using [docker](https://www.docker.com) or [helm](https://helm.sh)

### Installation

#### Dependencies

```sh
cd app/
npm install
```

#### Izettle

Follow the guide for adding products in izettle [here](https://www.izettle.com/gb/help/articles/2931484-managing-your-products-for-selling-online)

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


#### Izettle Credentials

The service expects to be provided with a valid credentials file, this is a JSON file with the following properties:
```json  
{
  "username": "<string>",
  "password": "<string>",
  "client_id": "<string>",
  "client_secret": "<string>"
}  
```

Since Izettle doesn't have support for service accounts, It is recomended to create a new user/"staff member" and use their credentials as the username and password (client id and secret can be obtained by signing up for a developer account as well as a ordinary account).

## Documentation

More information about the app and helm chart can be found [here](./docs/)