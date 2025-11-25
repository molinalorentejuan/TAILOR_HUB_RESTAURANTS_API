#  Build
FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Runtime
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Carpeta para la DB
RUN mkdir -p /app/data

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY swagger ./swagger

COPY src/db/restaurants.db /app/data/restaurants.db

# Permisos para el archivo
RUN chown -R appuser:appgroup /app/data /app/dist /app/swagger
RUN chmod 664 /app/data/restaurants.db

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]