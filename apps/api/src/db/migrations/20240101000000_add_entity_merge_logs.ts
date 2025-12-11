import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('entity_merge_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('primary_entity_id')
      .notNullable()
      .references('id')
      .inTable('entities')
      .onDelete('RESTRICT');
    table
      .uuid('duplicate_entity_id')
      .notNullable()
      .references('id')
      .inTable('entities')
      .onDelete('RESTRICT');
    table.jsonb('merged_fields').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.text('note');
    table.timestamps(true, true);
    table.index(['primary_entity_id']);
    table.index(['duplicate_entity_id']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('entity_merge_logs');
}
