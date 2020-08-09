const path = require("path");

module.exports = {
  type: "postgres",
  host: "localhost",
  port: process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, process.env.TYPEORM_ENTITIES_PATH)],
  migrations: [path.join(__dirname, process.env.TYPEORM_MIGRATIONS_PATH)],
  subscribers: [path.join(__dirname, process.env.TYPEORM_SUBSCRIBERS_PATH)],
  cli: {
    entitiesDir: "src/server/db/schema",
    migrationsDir: "src/server/db/migration",
    subscribersDir: "src/server/db/subscriber",
  },
};
