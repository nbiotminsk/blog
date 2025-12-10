# Nikolai

Backend services for the Nikolai blog, consisting of the main API and a dedicated document generation microservice.

## Project layout

```
apps/
  api/
    src/
      config/        # environment-aware configuration loader
      db/            # knex client, migrations, and seeds
      middleware/    # shared Express middleware (request-scoped db helper)
      routes/        # API route handlers (e.g., /api/health)
  doc-service/
    src/
      config/        # service configuration
      middleware/    # request logging, error handling, file uploads
      routes/        # health, template parsing, document rendering
      services/      # template parser, document renderer (CarboneJS)
      utils/         # file operations, logging
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

## Doc Service

A dedicated microservice for template parsing and document generation using CarboneJS. See [`apps/doc-service/README.md`](apps/doc-service/README.md) for detailed documentation.

### Quick start

```bash
cd apps/doc-service
npm install
cp .env.example .env
npm run dev
```

The service will start on port 3001 (configurable via `PORT` environment variable) and exposes:

- `GET /health` – health check
- `POST /templates/parse` – extract placeholders from DOCX/HTML templates
- `POST /documents/render` – generate documents from templates with JSON data

### Template syntax

The doc-service supports two placeholder syntaxes:

- `{{placeholder}}` – Standard double-brace syntax (for DOCX with docxtemplater)
- `{d.placeholder}` – CarboneJS syntax (for HTML and format conversion)

Both syntaxes are detected during parsing. For rendering, use CarboneJS syntax `{d.field}` for best compatibility with format conversion features.
