# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /usr/src/app
ENV NODE_ENV=production

# ---------- deps ----------
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ---------- builder ----------
FROM deps AS builder
ENV NODE_ENV=development
COPY tsconfig*.json nest-cli.json .prettierrc eslint.config.mjs ./
COPY prisma ./prisma
RUN npx prisma generate
# Install missing type definitions for build
RUN npm install --save-dev @types/express @types/multer @types/node
COPY src ./src
RUN npm run build

# ---------- runner ----------
FROM node:22-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

# Copy node_modules and built files
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./package.json
COPY prisma ./prisma

# Default port
ENV PORT=4000
EXPOSE 4000

# Healthcheck (optional)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://localhost:'+ (process.env.PORT||3000) +'/api/video-analyzer/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.js"]