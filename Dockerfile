FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --include=dev

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure the public directory is writable by the runtime user that will run the container
RUN chown -R nextjs:nodejs /app/public || true

COPY entrypoint.sh ./
COPY drizzle.config.ts ./
COPY --from=builder /app/src/db/schema ./src/db/schema
# Copy package.json and package-lock.json so we can install exact runtime deps from the lockfile
COPY package.json package-lock.json ./
RUN chmod +x entrypoint.sh

# Install runtime dependencies exactly as in package-lock to avoid version mismatches
# (avoids pulling newer incompatible versions of Next/React at runtime)
RUN npm ci --omit=dev --omit=optional

EXPOSE 3000
USER nextjs

CMD ["./entrypoint.sh"]