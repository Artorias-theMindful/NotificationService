const knex = require('knex');
const config = require('../db/knexfile');

export const db = knex(config.development);