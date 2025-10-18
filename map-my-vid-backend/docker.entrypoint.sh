#!/bin/sh
set -e

# Generate Prisma client
if [ -d "prisma" ]; then
  npx prisma generate
fi

# Run migrations if requested
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  npx prisma migrate deploy
fi

# Build if needed (dev mounts src)
if [ ! -d "dist" ] || [ "${BUILD_ON_START}" = "true" ]; then
  npm run build
fi

exec node dist/main.js