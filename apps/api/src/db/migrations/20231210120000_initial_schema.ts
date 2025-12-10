import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm');

  await knex.schema.createTable('entities', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phone');
    table.string('external_reference');
    table.jsonb('metadata').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
  });

  await knex.schema.raw(`
    ALTER TABLE entities
    ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('simple', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(email, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(phone, '')), 'C')
    ) STORED
  `);

  await knex.schema.raw('CREATE INDEX entities_search_vector_idx ON entities USING GIN (search_vector)');
  await knex.schema.raw('CREATE INDEX entities_name_trgm_idx ON entities USING gin (name gin_trgm_ops)');
  await knex.schema.raw('CREATE INDEX entities_email_trgm_idx ON entities USING gin (email gin_trgm_ops)');
  await knex.schema.raw('CREATE INDEX entities_phone_trgm_idx ON entities USING gin (phone gin_trgm_ops)');

  await knex.schema.createTable('categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable().unique();
    table.text('description');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('entity_categories', (table) => {
    table.uuid('entity_id').notNullable();
    table.uuid('category_id').notNullable();
    table.primary(['entity_id', 'category_id']);
    table
      .foreign('entity_id')
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE');
    table
      .foreign('category_id')
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE');
    table.unique(['entity_id', 'category_id']);
    table.timestamps(true, true);
  });

  await knex.schema.raw("CREATE TYPE template_format AS ENUM ('docx', 'html')");
  await knex.schema.createTable('templates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.text('description');
    table
      .enu('format', ['docx', 'html'], {
        useNative: true,
        enumName: 'template_format',
      })
      .notNullable();
    table.specificType('placeholders', 'text[]').notNullable().defaultTo(knex.raw("'{}'::text[]"));
    table.string('storage_path').notNullable();
    table.jsonb('metadata').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
  });

  await knex.schema.raw(
    "CREATE TYPE document_status AS ENUM ('pending', 'processing', 'completed', 'failed')",
  );
  await knex.schema.createTable('document_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('entity_id')
      .notNullable()
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE');
    table
      .uuid('template_id')
      .notNullable()
      .references('id')
      .inTable('templates')
      .onDelete('RESTRICT');
    table
      .enu('status', ['pending', 'processing', 'completed', 'failed'], {
        useNative: true,
        enumName: 'document_status',
      })
      .notNullable()
      .defaultTo('pending');
    table.string('doc_service_job_id');
    table.string('generated_file_path');
    table.string('generated_file_url');
    table.jsonb('payload').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.jsonb('error').defaultTo(null);
    table.timestamp('requested_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('completed_at');
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('document_records', (table) => {
    table.index(['entity_id']);
    table.index(['template_id']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('document_records', (table) => {
    table.dropIndex(['entity_id']);
    table.dropIndex(['template_id']);
    table.dropIndex(['status']);
  });

  await knex.schema.dropTableIfExists('document_records');
  await knex.schema.dropTableIfExists('templates');
  await knex.schema.dropTableIfExists('entity_categories');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('entities');

  await knex.schema.raw('DROP TYPE IF EXISTS document_status');
  await knex.schema.raw('DROP TYPE IF EXISTS template_format');
}
