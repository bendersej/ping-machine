# Ping Machine

The ping machine does the following:

- it syncs the list of machines to ping, calling the intranet server, _every hour_
- pings a set of machines, _every minute_
- posts a set of machines for which the state has changed: OK (0) -> Warning (1) -> Critical (2), _every minute, if there are state changes_

## Dev

1. Install DOCKER
2. Run `yarn install` to install all the dependencies
3. Create and popule `.env` with the following:

```
NODE_ENV="development"
PG_PORT=5432
PG_USERNAME="user"
PG_PASSWORD="password"
PG_DATABASE="ping-machine"
TYPEORM_ENTITIES_PATH=src/db/entities/**/*.ts
TYPEORM_MIGRATIONS_PATH=src/db/migration/**/*.ts
TYPEORM_SUBSCRIBERS_PATH=src/db/subscriber/**/*.ts

SERVER_PORT=3000
INTRANET_MOCK_SERVER_PORT=4000

INTRANET_SERVER_URL=http://localhost:4000
```

4. Run `docker-compose up -d` to create / start the databse
5. Run `yarn run-db-migrations`
6. Run `yarn start-mock-server`
7. Run `yarn dev` to run the ping-machine server

## API

- `POST /ping` will allow to ping a given set of machines if `{ targets: {"target_id": string }[]}` is provided, otherwise will ping all the machines present in DB
- `POST /sync` will sync the list of machines with the Intranet (will fail without `.5` of of #Dev)

## Deploy

Todo
