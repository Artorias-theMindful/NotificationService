import type { Knex } from "knex";
import { config as dotenvConfig } from 'dotenv';
import path from 'path';
dotenvConfig({ path: path.resolve(__dirname, '../../.env') });
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: process.env.URL,
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
