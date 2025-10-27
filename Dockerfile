# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Use BuildKit secret to set environment variable during build
# The secret is mounted as a file and read at build time
RUN --mount=type=secret,id=env \
    if [ -f /run/secrets/env ]; then \
      export $(cat /run/secrets/env | grep -v '^#' | xargs); \
    fi && \
    npm run build

# Production stage
FROM nginx:alpine

# Copy built application artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
