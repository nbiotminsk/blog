import type { Knex } from 'knex';

const textArray = (knexInstance: Knex, values: string[]) =>
  knexInstance.raw(`ARRAY[${values.map(() => '?').join(', ')}]::text[]`, values);

export async function seed(knex: Knex): Promise<void> {
  await knex('document_records').del();
  await knex('entity_categories').del();
  await knex('templates').del();
  await knex('categories').del();
  await knex('entities').del();

  const [financialServices, consulting] = await knex('categories')
    .insert([
      {
        name: 'Financial Services',
        description: 'Banking, insurance, and capital markets clients',
      },
      {
        name: 'Consulting',
        description: 'Strategy and advisory clients',
      },
    ])
    .returning('*');

  const [nikolaiEntity, avaEntity] = await knex('entities')
    .insert([
      {
        name: 'Nikolai Romanov',
        email: 'nikolai@example.com',
        phone: '+1-202-555-0119',
        metadata: { company: 'Nikolai Holdings' },
      },
      {
        name: 'Ava Consulting Group',
        email: 'ops@avaconsulting.io',
        phone: '+1-415-555-0192',
        metadata: { website: 'https://avaconsulting.io' },
      },
    ])
    .returning('*');

  await knex('entity_categories').insert([
    {
      entity_id: nikolaiEntity.id,
      category_id: financialServices.id,
    },
    {
      entity_id: avaEntity.id,
      category_id: consulting.id,
    },
  ]);

  const [docxTemplate, htmlTemplate] = await knex('templates')
    .insert([
      {
        name: 'Client Welcome Letter',
        description: 'Welcome letter for new onboarded entities',
        format: 'docx',
        placeholders: textArray(knex, ['client_name', 'support_email', 'doc_date']),
        storage_path: 's3://templates/client-welcome.docx',
        metadata: { version: 1 },
      },
      {
        name: 'Engagement Summary',
        description: 'HTML summary of all engagement touch points',
        format: 'html',
        placeholders: textArray(knex, ['client_name', 'category', 'summary_points']),
        storage_path: 's3://templates/engagement-summary.html',
        metadata: { version: 3 },
      },
    ])
    .returning('*');

  await knex('document_records').insert([
    {
      entity_id: nikolaiEntity.id,
      template_id: docxTemplate.id,
      status: 'completed',
      doc_service_job_id: 'job_123',
      generated_file_path: '/tmp/documents/welcome-letter.docx',
      generated_file_url: 'https://files.example.com/welcome-letter.docx',
      payload: { preparedBy: 'system' },
      completed_at: knex.fn.now(),
    },
    {
      entity_id: avaEntity.id,
      template_id: htmlTemplate.id,
      status: 'processing',
      doc_service_job_id: 'job_456',
      payload: { assignedTo: 'nikolai' },
    },
  ]);
}
