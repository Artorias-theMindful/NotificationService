import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('notifications', function (table) {
        table.increments('id').primary();
        table.integer('created_by').notNullable();
        table.integer('sent_to').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.boolean('is_read').defaultTo(false);
      });
}


export async function down(knex: Knex): Promise<void> {
}

