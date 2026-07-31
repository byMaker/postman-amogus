# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Keep only production dependencies to minimize image size
RUN npm ci --omit=dev

# Production stage
FROM node:22-alpine
# Install dumb-init for proper signal handling (graceful shutdown)
RUN apk add --no-cache dumb-init

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

# Switch to the non-root user for security
USER node

# Wrap the execution in dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "build"]
