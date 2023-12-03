## Tech-Stack

Tech stack used in this codebase is

- Typescript
- Javascript
- MongoDB
- Mongoose
- Fastify
- Vitest (only for testing)
- pnpm

## Folder Structure

`src` - Source code for the entire Service
`db` - Utility functions/files related to database, might contain some migration files in future
`functions` - Utility function that are being used in the routes/logic
`models` - Mongoose Models created to communicate with MongoDB
`routes` - Fastify Plugin based routes & logic
`tests` - Code related to tests

## Environment variables

Environment variables are being used in this codebase to provide the config for functionality of application.

`JWT_SECRET` - String to encrypt the user's authentication token
`PORT` - Port to start the server on
`HOST` - Host to run the server
`SALT_ROUNDS` - Number of encryption rounds to encrypt password
`DB_CONNECTION_STRING` - MongoDB URI to connect and do database functionalities
`USER_SERVICE` - User Service URL to communicate with user-service (Optional, used only for testing)

## Running Server

To run the server on local machine run the following command

```sh
pnpm dev
```

## Running tests

To run the tests on your local machine run the following command

```sh
pnpm test
```

After running the tests `vitest` creates a report of the test suite. To View the report run the following command

```sh
pnpm coverage
```
