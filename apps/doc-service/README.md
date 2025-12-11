# Doc Service

A dedicated Node.js microservice (TypeScript) for template parsing and document generation using CarboneJS.

## Features

- **Template Parsing**: Extract `{{placeholder}}` tokens from DOCX and HTML templates
- **Document Rendering**: Generate documents from templates with JSON data using CarboneJS
- **Format Conversion**: Convert documents to PDF, DOCX, ODT, or HTML
- **File Management**: Safe temporary file handling with automatic cleanup
- **Structured Logging**: Comprehensive logging with Pino
- **Health Checks**: Built-in health check endpoint

## API Endpoints

### `GET /health`

Health check endpoint returning service status and uptime.

**Response:**
```json
{
  "status": "healthy",
  "service": "doc-service",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### `POST /templates/parse`

Parse a template file to extract placeholder variables.

**Request (multipart/form-data):**
- `template` (file): Template file (DOCX or HTML)

**OR Request (JSON):**
```json
{
  "path": "relative/or/absolute/path/to/template.docx"
}
```

**Response:**
```json
{
  "placeholders": ["name", "email", "date"],
  "metadata": {
    "filename": "template.docx",
    "size": 12345,
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  }
}
```

### `POST /documents/render`

Render a document from a template with provided data.

**Request (multipart/form-data):**
- `template` (file): Template file (DOCX, HTML, or ODT)
- `data` (JSON string or object): Data to populate the template
- `convertTo` (optional): Output format (`pdf`, `docx`, `odt`, `html`)

**OR Request (JSON):**
```json
{
  "path": "relative/or/absolute/path/to/template.docx",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2024-01-01"
  },
  "convertTo": "pdf"
}
```

**Response:**
```json
{
  "filename": "template_generated.pdf",
  "mimeType": "application/pdf",
  "size": 54321,
  "document": "base64EncodedDocumentData..."
}
```

## Getting Started

### Installation

```bash
cd apps/doc-service
npm install
```

### Configuration

Copy the environment template:

```bash
cp .env.example .env
```

Environment variables:
- `PORT`: Service port (default: 3001)
- `NODE_ENV`: Environment (`development`, `production`, `test`)
- `LOG_LEVEL`: Logging level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`)
- `TEMPLATE_STORAGE_PATH`: Directory for stored templates (default: `/tmp/templates`)
- `TEMP_STORAGE_PATH`: Directory for temporary files (default: `/tmp/doc-service`)
- `CARBONE_TEMP_DIR`: CarboneJS temporary directory (default: `/tmp/carbone`)

### Development

Start the service in development mode with auto-reload:

```bash
npm run dev
```

### Production

Build and start the service:

```bash
npm run build
npm start
```

### Docker

Build the Docker image:

```bash
docker build -t doc-service .
```

Run the container:

```bash
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -v /path/to/templates:/tmp/templates \
  doc-service
```

## Development Scripts

- `npm run dev` – Start with auto-reload
- `npm run build` – Compile TypeScript to JavaScript
- `npm start` – Run compiled server
- `npm run lint` – Lint TypeScript files
- `npm run format` – Format code with Prettier
- `npm run typecheck` – Type check without compiling

## Dependencies

### Core
- **express**: Web framework
- **carbone**: Document generation engine
- **docxtemplater**: DOCX template parsing
- **pizzip**: ZIP file handling for DOCX
- **multer**: File upload handling
- **pino**: Structured logging
- **zod**: Schema validation

### Development
- **typescript**: TypeScript compiler
- **ts-node-dev**: Development server with auto-reload
- **eslint**: Code linting
- **prettier**: Code formatting

## Supported Template Formats

- **DOCX**: Microsoft Word documents
- **HTML**: HTML templates
- **ODT**: OpenDocument Text (requires LibreOffice for conversion)

## Supported Output Formats

- **PDF**: Portable Document Format (requires LibreOffice)
- **DOCX**: Microsoft Word
- **ODT**: OpenDocument Text
- **HTML**: HTML document

## Error Handling

All endpoints return structured error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

Common status codes:
- `400`: Bad request (validation errors, missing parameters)
- `500`: Internal server error (rendering failures, file system errors)

## Logging

The service uses structured logging with Pino. In development mode, logs are pretty-printed. In production, logs are output as JSON for easier parsing by log aggregation tools.

Log levels: `fatal`, `error`, `warn`, `info`, `debug`, `trace`

## File Cleanup

Temporary files are automatically cleaned up after processing. The service ensures:
- Uploaded files are deleted after parsing/rendering
- Carbone temporary files are managed by the library
- Failed operations clean up partial files
