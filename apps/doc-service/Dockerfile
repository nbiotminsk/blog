FROM node:20-alpine

RUN apk add --no-cache \
    libreoffice \
    openjdk11-jre \
    ttf-dejavu \
    fontconfig

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

RUN mkdir -p /tmp/templates /tmp/doc-service /tmp/carbone && \
    chmod 755 /tmp/templates /tmp/doc-service /tmp/carbone

ENV NODE_ENV=production
ENV PORT=3001
ENV TEMPLATE_STORAGE_PATH=/tmp/templates
ENV TEMP_STORAGE_PATH=/tmp/doc-service
ENV CARBONE_TEMP_DIR=/tmp/carbone

EXPOSE 3001

CMD ["node", "dist/server.js"]
