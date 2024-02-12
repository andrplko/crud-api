# CRUD-API Application

## About The Project

This is a simple CRUD API implementation using an in-memory database.

## Setup & Installation

1. Clone the repository

```
git clone https://github.com/andrplko/crud-api.git
```

2. Navigate to the `crud-api` directory

```
cd crud-api
```

3. Install all dependencies

```
npm install
```

## Scripts

### Common application scripts

- `start:dev`: starts the server with nodemon (for development).
- `start:prod`: starts the build process and then runs the bundled file
- `start:multi`: starts multiple instances of application using the Node.js Cluster API with a load balancer (using Round-robin algorithm)
- `test`: run tests with jest

### ESLint

- `lint:fix`: runs ESLint to fix code issues

### Prettier

- `format:fix`: runs prettier to check and auto format code
