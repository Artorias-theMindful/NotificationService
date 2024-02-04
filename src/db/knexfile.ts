import type { Knex } from "knex";
import path from "path"
import { CONFIG } from "../config";
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: CONFIG.DATABASE_URL,
    migrations: {
      directory: path.resolve(__dirname, './migrations')
    }
  },

  production: {
    client: "pg",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    }
  }

};

module.exports = config;
