# Multi-stage build for API service
FROM node:18-alpine AS base
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nikolai -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=development --chown=nikolai:nodejs /app/dist ./dist
COPY --from=development --chown=nikolai:nodejs /app/knexfile.ts ./
COPY --from=development --chown=nikolai:nodejs /app/src/db ./src/db

# Switch to non-root user
USER nikolai

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-3002}/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

EXPOSE 3002

CMD ["npm", "run", "start"]