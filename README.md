# Nikolai Document Management System

A comprehensive document generation and management system built with Node.js, React, and PostgreSQL, featuring template parsing, dynamic document generation, and a modern web interface.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     API         │    │ Document Service │
│   (React)       │◄───┤   (Express)     │◄───┤   (Express)      │
│   Port: 3000    │    │   Port: 3002    │    │   Port: 3001     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   File Storage  │    │    CarboneJS    │
│   Database      │    │   Templates/    │    │   Document      │
│   Port: 5432    │    │   Generated     │    │   Generation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Components

- **Frontend (React + TypeScript)**: Modern web interface with React Query for state management
- **API Service (Express + TypeScript)**: RESTful API with PostgreSQL integration and Knex.js migrations
- **Document Service (Express + TypeScript)**: Dedicated microservice for template parsing and document generation using CarboneJS
- **PostgreSQL**: Primary database for entities, categories, templates, and document records
- **Docker Orchestration**: Multi-container setup with health checks and shared volumes

### Key Features

- **Template Management**: Upload and parse DOCX/HTML templates with automatic placeholder detection
- **Entity Management**: Full CRUD operations for entities with full-text search capabilities
- **Document Generation**: Dynamic document creation from templates with JSON data inputs
- **Category System**: Flexible categorization with many-to-many relationships
- **File Storage**: Shared volumes for template storage and generated document storage
- **Health Monitoring**: Service health checks and status endpoints

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **pnpm** (v8 or higher) - npm comes with Node.js
- **Docker** and **Docker Compose** - [Download](https://www.docker.com/)

### Recommended Tools
- **Git** for version control
- **PostgreSQL Client** (optional) for database administration
- **VS Code** with TypeScript and Docker extensions

## Quick Start

### Option 1: Docker Setup (Recommended)

1. **Clone and Setup Environment**
   ```bash
   git clone <repository-url>
   cd nikolai
   cp .env.example .env
   # Edit .env with your preferred configuration
   ```

2. **Start All Services**
   ```bash
   docker compose up -d
   ```

3. **Run Database Migrations** (First time only)
   ```bash
   docker compose --profile migrate up
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:3002/api-docs
   - API Health Check: http://localhost:3002/api/health

### Option 2: Local Development

1. **Install Dependencies**
   ```bash
   # Install API dependencies
   cd apps/api
   npm install

   # Install Document Service dependencies
   cd ../doc-service
   npm install

   # Install Frontend dependencies
   cd ../web
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   # API Service
   cd apps/api
   cp .env.example .env

   # Document Service
   cd ../doc-service
   cp .env.example .env

   # Frontend
   cd ../web
   cp .env.example .env
   ```

3. **Database Setup**
   ```bash
   # Ensure PostgreSQL is running locally
   # Create database: nikolai
   createdb nikolai

   # Run migrations and seeds
   cd apps/api
   npm run migrate
   npm run seed
   ```

4. **Start Services** (in separate terminals)
   ```bash
   # Terminal 1: Document Service
   cd apps/doc-service
   npm run dev

   # Terminal 2: API Service
   cd apps/api
   npm run dev

   # Terminal 3: Frontend
   cd apps/web
   npm run dev
   ```

## Development Workflow

### Database Management

**Running Migrations:**
```bash
# API service directory
cd apps/api
npm run migrate          # Run latest migrations
npm run migrate:rollback # Rollback last migration
npm run migrate:status   # Check migration status
npm run seed            # Load seed data
```

**Database Connection:**
```bash
# Connect to PostgreSQL
psql -h localhost -U nikolai -d nikolai

# Or using docker
docker exec -it nikolai-postgres psql -U nikolai -d nikolai
```

### Service Management

**Docker Services:**
```bash
# Start specific service
docker compose up -d postgres
docker compose up -d api
docker compose up -d doc-service
docker compose up -d web

# View logs
docker compose logs -f api
docker compose logs -f doc-service
docker compose logs -f web

# Stop all services
docker compose down

# Reset database (removes all data)
docker compose down -v
```

**Local Development:**
```bash
# Each service directory
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Lint code
npm run format       # Format code
npm run typecheck    # Type checking
```

### Template Storage

The system uses Docker volumes for persistent file storage:

- **Templates Storage**: `templates` volume mapped to `/app/templates` in doc-service
- **Generated Documents**: `generated` volume mapped to `/app/generated` in doc-service
- **Uploads**: `uploads` volume mapped to `/app/uploads` in API service

**File Structure:**
```
/app/templates/          # Uploaded templates
├── template_1.docx
└── template_2.html

/app/generated/          # Generated documents
├── document_123.pdf
└── document_456.docx

/app/uploads/            # Temporary uploads
└── temp_files/
```

### CarboneJS Requirements

The document generation service uses CarboneJS for template processing:

**Supported Template Formats:**
- **DOCX**: Uses docxtemplater for placeholder replacement
- **HTML**: Uses CarboneJS syntax for dynamic content

**Placeholder Syntax:**
- **DOCX**: `{{placeholder_name}}` (standard template syntax)
- **HTML**: `{d.placeholder_name}` (CarboneJS syntax)

**Performance Considerations:**
- Large templates (>10MB) may require increased timeout
- Complex templates with many placeholders may need additional memory
- Generated documents are cached for improved performance

## API Documentation

### Core Endpoints

**Health Check:**
- `GET /api/health` - API service health status
- `GET /health` - Document service health status

**Entity Management:**
- `GET /api/entities` - List entities with pagination
- `POST /api/entities` - Create new entity
- `GET /api/entities/:id` - Get entity by ID
- `PATCH /api/entities/:id` - Update entity
- `DELETE /api/entities/:id` - Delete entity
- `GET /api/entities/search` - Search entities with filters

**Entity Deduplication:**
- `GET /api/entities/duplicates` - List duplicate entity pairs (paginated)
  - Query params: `threshold` (0-1, default 0.5), `limit` (default 20), `page` (default 1)
  - Response includes: `id1`, `name1`, `email1`, `phone1`, `id2`, `name2`, `email2`, `phone2`, `nameSimilarity`, `emailMatch`, `phoneMatch`, `compositeScore`
- `GET /api/entities/duplicates/check?id={entityId}` - Find duplicates for a specific entity
  - Query params: `id` (required, UUID), `threshold` (0-1, default 0.5)
  - Returns array of duplicate pairs
- `POST /api/entities/merge` - Merge two entities
  - Body: `{ primaryEntityId, duplicateEntityId, mergedFields, categoryIds?, note? }`
  - Updates primary entity, reassigns documents, transfers categories, logs merge, deletes duplicate
  - Returns merged entity snapshot

**Category Management:**
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get category by ID
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Template Management:**
- `GET /api/templates` - List all templates
- `POST /api/templates` - Upload new template
- `GET /api/templates/:id` - Get template by ID
- `DELETE /api/templates/:id` - Delete template

**Document Generation:**
- `POST /api/documents/generate` - Generate document from template
- `GET /api/documents/:id` - Get document record
- `GET /api/documents` - List document records

### Document Service API

**Template Parsing:**
- `POST /templates/parse` - Extract placeholders from template

**Document Rendering:**
- `POST /documents/render` - Generate document with CarboneJS

## Environment Variables

### Global Configuration (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `DB_NAME` | `nikolai` | Database name |
| `DB_USER` | `nikolai` | Database user |
| `DB_PASSWORD` | `password` | Database password |
| `DB_PORT` | `5432` | Database port |
| `WEB_PORT` | `3000` | Frontend port |
| `API_PORT` | `3002` | API service port |
| `DOC_SERVICE_PORT` | `3001` | Document service port |
| `LOG_LEVEL` | `info` | Logging level |

### Service-Specific Configuration

**API Service (.env in apps/api):**
- `PORT` - Service port (default: 3002)
- `DATABASE_URL` - PostgreSQL connection string
- `DOC_SERVICE_URL` - Document service URL
- `CORS_ORIGIN` - Frontend URL for CORS
- `MAX_FILE_SIZE` - Maximum upload file size

**Document Service (.env in apps/doc-service):**
- `PORT` - Service port (default: 3001)
- `TEMPLATE_DIR` - Template storage directory
- `GENERATED_DIR` - Generated documents directory
- `CARBONE_TIMEOUT` - Document generation timeout

**Frontend (.env in apps/web):**
- `VITE_API_URL` - Backend API URL
- `VITE_PORT` - Development server port

## Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up -d postgres
```

**Service Startup Issues:**
```bash
# Check service status
docker compose ps

# View service logs
docker compose logs [service-name]

# Restart specific service
docker compose restart [service-name]
```

**Port Conflicts:**
```bash
# Check port usage
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :5432

# Kill process using port
kill -9 $(lsof -t -i:3000)
```

**Template Upload Issues:**
- Ensure file size is within `MAX_FILE_SIZE` limits
- Check file format is supported (DOCX, HTML)
- Verify templates directory has proper permissions

**Memory Issues with Large Templates:**
- Increase Docker memory limit for doc-service
- Adjust `CARBONE_TIMEOUT` for complex templates
- Consider splitting large templates into smaller parts

## Entity Deduplication Guide

The system provides comprehensive entity deduplication capabilities to identify and merge duplicate entity records.

### How It Works

**Similarity Scoring:**
The system uses a weighted scoring algorithm to identify potential duplicates:
- **Name Similarity** (40%): Levenshtein distance-based fuzzy matching
- **Email Match** (35%): Case-insensitive exact matching
- **Phone Match** (25%): Normalized phone number exact matching

Scoring ranges from 0 (completely different) to 1 (identical).

### Usage Examples

**Find All Duplicates**
```bash
# List all duplicate pairs with default threshold (0.5)
curl http://localhost:3002/api/entities/duplicates

# With custom threshold (find very similar entities)
curl "http://localhost:3002/api/entities/duplicates?threshold=0.8&limit=50&page=1"
```

**Check Duplicates for Specific Entity**
```bash
curl "http://localhost:3002/api/entities/duplicates/check?id=550e8400-e29b-41d4-a716-446655440000&threshold=0.6"
```

**Merge Entities**
```bash
curl -X POST http://localhost:3002/api/entities/merge \
  -H "Content-Type: application/json" \
  -d '{
    "primaryEntityId": "550e8400-e29b-41d4-a716-446655440000",
    "duplicateEntityId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "mergedFields": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123"
    },
    "categoryIds": ["category-id-1", "category-id-2"],
    "note": "Merged duplicate record from import"
  }'
```

### Merge Behavior

When two entities are merged:
1. **Primary Entity** is updated with merged fields
2. **Document Records** - All documents linked to the duplicate are reassigned to the primary entity
3. **Categories** - Categories from the duplicate are transferred to the primary entity
4. **Merge Logging** - A record is created in `entity_merge_logs` table for audit trail
5. **Deletion** - The duplicate entity is deleted (done in transaction for safety)

All operations are wrapped in a database transaction to ensure data consistency.

### Development Tips

**Hot Reload:**
- Frontend supports hot module replacement
- API and doc-service use `ts-node-dev` for automatic restarts

**Debugging:**
```bash
# Enable debug logging
LOG_LEVEL=debug docker compose up

# Attach to service logs
docker compose logs -f [service-name]

# Execute commands in running container
docker compose exec api sh
docker compose exec doc-service sh
```

**Database Administration:**
```bash
# Connect to database
docker compose exec postgres psql -U nikolai -d nikolai

# Backup database
docker compose exec postgres pg_dump -U nikolai nikolai > backup.sql

# Restore database
docker compose exec -T postgres psql -U nikolai nikolai < backup.sql
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details
