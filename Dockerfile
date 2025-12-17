# =========================
# Stage 1: Build Frontend
# =========================
FROM node:18-bullseye AS builder

WORKDIR /app

# Copy dependency descriptors first (cache friendly)
COPY package.json package-lock.json ./

# Install ALL dependencies (build requires devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build Vite app
RUN npm run build


# =========================
# Stage 2: Runtime (Nginx)
# =========================
FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build result from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose container port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]