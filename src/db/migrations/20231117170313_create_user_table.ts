import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('username').notNullable();
      });
}


export async function down(knex: Knex): Promise<void> {
}

