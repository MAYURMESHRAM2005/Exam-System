# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first so this layer is cached unless package*.json changes
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .

# Evidence snapshots captured by AI proctoring are written here at runtime —
# create it (and hand it to the non-root user below) so the container
# doesn't need write access to the rest of the filesystem.
RUN mkdir -p /app/uploads/evidence

# Run as a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
