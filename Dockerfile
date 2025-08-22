# Multi-stage build for optimized production image
FROM node:22.12-alpine AS builder

WORKDIR /app

# Copy package files and source code
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/

# Install all dependencies (including devDependencies for build)
RUN --mount=type=cache,target=/root/.npm npm install --ignore-scripts

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS release

WORKDIR /app

# Copy built application and package files from builder
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --ignore-scripts --omit=dev

# Set production environment
ENV NODE_ENV=production

# Run as non-root user for security
USER node

# Command to run the server
CMD ["node", "dist/src/index.js"]