# Use Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY app/package.json ./app/

# Install dependencies
RUN npm ci --only=production --workspace app

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY app/package.json ./app/

# Install all dependencies (including devDependencies)
RUN npm ci --workspace app

# Copy source code
COPY app ./app

# Build the application
WORKDIR /app/app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/app/public ./app/public

# Set permissions for prerender cache
RUN mkdir -p ./app/.next
RUN chown nextjs:nodejs ./app/.next

# Copy built application files
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/app/.next/static ./app/.next/static

# Switch to nextjs user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment
ENV PORT 3000
ENV NODE_ENV production

# Start the application
CMD ["node", "app/server.js"]
