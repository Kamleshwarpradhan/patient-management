FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

# Set build-time env (overridden at runtime via docker-compose)
ENV NEXT_PUBLIC_API_URL=http://localhost:8088

RUN npm run build

# ─── Production Runner ───
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed for production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
