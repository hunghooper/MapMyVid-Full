# ---------- base ----------
FROM node:18-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production

# ---------- deps ----------
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ openssl
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --only=production

# ---------- builder ----------
FROM base AS builder
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY tsconfig*.json nest-cli.json .prettierrc eslint.config.mjs ./
COPY prisma ./prisma
RUN npx prisma generate
# Install missing type definitions for build
RUN npm install --save-dev @types/express @types/multer @types/node
COPY src ./src
RUN npm run build

# ---------- runner ----------
FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=deps --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/prisma ./prisma
COPY --chown=nestjs:nodejs package.json ./

# Default port (Render uses PORT env var)
ENV PORT=3000
EXPOSE 3000

# Healthcheck với endpoint đúng
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http');const options={hostname:'localhost',port:process.env.PORT||3000,path:'/api/health',method:'GET'};const req=http.request(options,(res)=>{process.exit(res.statusCode===200?0:1)});req.on('error',()=>process.exit(1));req.end();"

# Start command với migration
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]