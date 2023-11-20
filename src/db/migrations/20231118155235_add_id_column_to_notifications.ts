import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('notifications', function (table) {
        table.increments('id').primary();
      });
}


export async function down(knex: Knex): Promise<void> {
}

