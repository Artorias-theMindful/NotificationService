import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('notifications', function (table) {
        table.text('text');
      });
}


export async function down(knex: Knex): Promise<void> {
}


