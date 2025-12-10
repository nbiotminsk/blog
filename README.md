# Nikolai

Backend scaffolding for the Nikolai blog is now located under `apps/api`. The service is built with Node.js, Express, TypeScript, and Knex for PostgreSQL migrations and query building.

## Project layout

```
apps/
  api/
    src/
      config/        # environment-aware configuration loader
      db/            # knex client, migrations, and seeds
      middleware/    # shared Express middleware (request-scoped db helper)
      routes/        # API route handlers (e.g., /api/health)
```

## Getting started

1. Install dependencies:
   ```bash
   cd apps/api
   npm install
   ```
2. Copy the environment template and adjust values such as `PORT`, `DATABASE_URL`, and `DOC_SERVICE_URL` as needed:
   ```bash
   cp .env.example .env
   ```
3. Run database migrations (and optional seed data for fixtures):
   ```bash
   npm run migrate
   npm run seed
   ```
4. Start the API in watch mode:
   ```bash
   npm run dev
   ```

### Available npm scripts (run from `apps/api`)

- `npm run dev` – start the Express server with `ts-node-dev`
- `npm run build` – emit compiled JavaScript to `dist`
- `npm run start` – run the compiled server
- `npm run lint` / `npm run format` – lint or format the TypeScript sources
- `npm run typecheck` – verify TypeScript types without emitting output
- `npm run migrate` / `npm run migrate:rollback` / `npm run migrate:status` – manage Knex migrations
- `npm run seed` – load the development fixtures defined in `src/db/seeds`

### Database schema

Initial migrations provision the following tables and indexes:

- `entities` with JSON metadata, request-scoped helper access, trigram indexes, and a `tsvector` column for GIN-backed full-text search across name/email/phone
- `categories` and the `entity_categories` junction that enforces uniqueness per entity/category pair
- `templates` describing DOCX/HTML templates, placeholder arrays, and storage metadata
- `document_records` tracking generation jobs, statuses (`pending`, `processing`, `completed`, `failed`), and generated file info

### Seeds and fixtures

Development seeds populate reference categories, entities, templates, and document records so local testing can start immediately. Re-run `npm run seed` whenever you need a clean baseline dataset.
