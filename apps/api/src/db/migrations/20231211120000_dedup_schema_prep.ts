import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Ensure fuzzystrmatch extension is available (in addition to pg_trgm)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS fuzzystrmatch');

  // Add normalized_phone column to entities table with a generated column
  // that strips non-digits from the phone field for deduplication
  await knex.schema.raw(`
    ALTER TABLE entities
    ADD COLUMN normalized_phone text GENERATED ALWAYS AS (
      regexp_replace(phone, '[^0-9]', '', 'g')
    ) STORED
  `);

  // Create index on normalized_phone for faster equality checks
  await knex.schema.raw(
    'CREATE INDEX entities_normalized_phone_idx ON entities (normalized_phone) WHERE normalized_phone IS NOT NULL',
  );

  // Create entity_merge_logs table to capture merge history
  await knex.schema.createTable('entity_merge_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    // References to the entities involved
    table
      .uuid('primary_entity_id')
      .notNullable()
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE');

    table
      .uuid('merged_entity_id')
      .notNullable()
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE');

    // JSONB snapshots of original entities
    table.jsonb('primary_entity_snapshot').notNullable();
    table.jsonb('merged_entity_snapshot').notNullable();

    // JSONB payload of the merge result
    table.jsonb('merged_payload').notNullable();

    // Array of document IDs that were updated during merge
    table.specificType('updated_document_ids', 'uuid[]').defaultTo(knex.raw("'{}'::uuid[]"));

    // Optional metadata about the merge
    table.text('notes');
    table.string('performed_by');

    // Timestamps
    table.timestamps(true, true);
  });

  // Create indexes for better query performance
  await knex.schema.alterTable('entity_merge_logs', (table) => {
    table.index(['primary_entity_id']);
    table.index(['merged_entity_id']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop entity_merge_logs table and its indexes
  await knex.schema.alterTable('entity_merge_logs', (table) => {
    table.dropIndex(['primary_entity_id']);
    table.dropIndex(['merged_entity_id']);
    table.dropIndex(['created_at']);
  });

  await knex.schema.dropTableIfExists('entity_merge_logs');

  // Drop normalized_phone index
  await knex.schema.raw('DROP INDEX IF EXISTS entities_normalized_phone_idx');

  // Drop normalized_phone column from entities
  await knex.schema.raw('ALTER TABLE entities DROP COLUMN IF EXISTS normalized_phone');
}
