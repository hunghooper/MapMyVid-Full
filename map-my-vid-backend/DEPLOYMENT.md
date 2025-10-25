# 🚀 Deployment Guide - Map My Vid Backend

## 📋 Prerequisites

- Docker installed
- Render account
- PostgreSQL database (Render or external)
- Environment variables configured

## 🐳 Docker Deployment

### Local Testing
```bash
# Build image
docker build -t map-my-vid-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e GEMINI_API_KEY="your_gemini_key" \
  -e FRONTEND_URLS="http://localhost:3000" \
  map-my-vid-backend
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## ☁️ Render Deployment

### 1. Environment Variables
Set these in Render dashboard:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@host:port/database
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URLS=https://your-frontend-domain.vercel.app
```

### 2. Render Settings
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npx prisma migrate deploy && npm run start:prod`
- **Root Directory**: `map-my-vid-backend` (if using monorepo)

### 3. Database Setup
1. Create PostgreSQL database on Render
2. Copy the Internal Database URL
3. Set as `DATABASE_URL` environment variable

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails - Missing Types**
   ```bash
   # Solution: Install dev dependencies during build
   npm install --save-dev @types/express @types/multer @types/node
   ```

2. **Database Connection Error**
   ```bash
   # Check DATABASE_URL format
   postgresql://username:password@host:port/database?sslmode=require
   ```

3. **CORS Issues**
   ```bash
   # Update FRONTEND_URLS with correct domain
   FRONTEND_URLS=https://your-frontend-domain.vercel.app
   ```

4. **Prisma Migration Fails**
   ```bash
   # Reset database (development only)
   npx prisma migrate reset
   npx prisma migrate dev
   ```

### Health Check Endpoints

- **Health**: `GET /api/health`
- **API Docs**: `GET /api/docs`
- **Database**: Check logs for Prisma connection

## 📊 Performance Optimization

### Docker Image Size
- Multi-stage build reduces size from ~500MB to ~200MB
- Only production dependencies in final image
- Non-root user for security

### Database Optimization
- Connection pooling enabled
- Indexes on frequently queried fields
- Prisma query optimization

## 🔒 Security Features

- Helmet.js for security headers
- CORS properly configured
- Input validation with class-validator
- Non-root Docker user
- Environment variable validation

## 📈 Monitoring

### Logs
- Application logs via console
- Error tracking with GlobalExceptionFilter
- Health check monitoring

### Metrics
- Response time tracking
- Database query performance
- Memory usage monitoring

## 🚀 Production Checklist

- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] CORS configured for production domain
- [ ] Health check endpoint working
- [ ] SSL certificate configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Error tracking configured

## 📞 Support

For deployment issues:
1. Check Render logs
2. Verify environment variables
3. Test database connection
4. Check CORS configuration
5. Review application logs
