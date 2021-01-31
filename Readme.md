# NodeJS Server - G2i Challenge

Just a NodeJs / Express server connected to a MongoDB database located in a mongo atlas cluster.

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install the server.

```bash
yarn install
```

## Run the server

To start the server you will only need to run the command:

```bash
yarn run dev
```

## Generate auth token

To generate a valid auth token and use the authenticated methods please trigger a POST call to the method


```bash
POST http://localhost:8001/api/login
```

with the user as request body (JSON)

```bash
{ "username": "test", "password": "test-password" }
```

## Postman Collection

in the root folder you will find a postman collection to check the endpoints working:

```bash
g2i.postman_collection.json
```
