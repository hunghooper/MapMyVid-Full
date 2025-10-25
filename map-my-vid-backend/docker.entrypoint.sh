#!/bin/sh
set -e

echo "🚀 Starting Map My Vid Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
npx prisma db push --accept-data-loss || true

# Run migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Start the application
echo "🎯 Starting application..."
exec node dist/main.js