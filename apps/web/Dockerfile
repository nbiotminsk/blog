# Multi-stage build for frontend service
FROM node:18-alpine AS base
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Development stage
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user and set permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nikolai -u 1001 && \
    chown -R nikolai:nodejs /usr/share/nginx/html && \
    chown -R nikolai:nodejs /var/cache/nginx && \
    chown -R nikolai:nodejs /var/log/nginx && \
    chown -R nikolai:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER nikolai

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]