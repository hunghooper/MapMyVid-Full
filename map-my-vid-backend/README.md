# Map My Vid Backend (NestJS)

Backend dịch vụ phân tích video để trích xuất địa điểm (AI + Google Maps), xác thực JWT, CRUD người dùng/địa điểm, tích hợp S3, Prisma/PostgreSQL, và Swagger.

## Kiến trúc & cấu trúc thư mục

```
src/
├── common/                  # Logic dùng chung (guards, decorators, utils...)
│   ├── decorators/
│   ├── guards/
│   └── utils/
├── config/                  # Cấu hình (mở rộng khi cần)
├── database/                # PrismaService & module DB
├── modules/                 # Domain modules
│   ├── auth/
│   ├── users/
│   ├── video-analyzer/      # Gemini + Google Maps
│   ├── locations/           # CRUD Location
│   └── admin/               # Quản trị (role-based)
├── app.module.ts
└── main.ts
```

## Yêu cầu hệ thống
- Node.js >= 20 (Docker dùng Node 22 Alpine)
- PostgreSQL (mặc định, có docker-compose)
- Prisma CLI

## Cấu hình môi trường (.env)
Tạo file `.env` ở project root:

```
# App
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Database (compose sẽ override tới db container)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mapmyvid?schema=public

# Google
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# AWS S3
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
```

## Cài đặt & chạy cục bộ
```bash
npm install
npm run prisma:generate
# Khởi tạo DB nếu cần
# npm run prisma:migrate:dev

# Dev
npm run start:dev

# Build & Prod
npm run build
npm run start:prod
```

Swagger: truy cập `http://localhost:<PORT>/api/docs` (Bearer JWT).

## Docker (Production-ready)
- Multi-stage build (cache layer), Prisma generate trong stage build
- Healthcheck endpoint

Build & chạy nhanh:
```bash
# Build image prod
docker build -t map-my-vid-backend .
# Chạy
docker run --env-file .env -p 3000:4000 map-my-vid-backend
# (Dockerfile hiện EXPOSE 4000; map port theo nhu cầu)
```

## docker-compose (Dev + DB)
`docker-compose.yml` đã bao gồm:
- Service `db` (Postgres 16)
- Service `app` (NestJS), mount volume src/prisma/uploads cho dev
- Tự động `prisma generate`, build và chạy app

Chạy:
```bash
docker compose up --build
```
Mặc định `DATABASE_URL` sẽ trỏ tới `db` container nếu bạn chưa set thủ công.

## Prisma
```bash
# Generate client
npm run prisma:generate
# Migration dev (tạo bảng)
npm run prisma:migrate:dev
# Deploy migration (prod/CI)
npm run prisma:migrate:deploy
```

## Bảo mật & gợi ý CI/CD
- Dùng biến môi trường bí mật qua Secret Manager (GitHub Actions / AWS SSM)
- Chạy `npm ci` thay vì `npm install` trong CI để cache tốt hơn
- Thêm rule CORS cụ thể domain production
- Bật `helmet`, rate-limiter khi public
- Thêm stage migrate tự động (`prisma migrate deploy`) trước khi khởi động app trong CI/CD

## Các module chính
- Auth: JWT, Guards (JwtAuthGuard, RolesGuard), decorators `@CurrentUser()`, `@Roles()`
- Users: đọc thông tin profile
- Video Analyzer: upload video (memory), lưu S3, phân tích bằng Gemini, tìm Google Maps
- Locations: CRUD theo user
- Admin: quản trị user (SUPER_ADMIN), thống kê

## API Docs
- Swagger: `GET /api/docs`
- Health: `GET /api/video-analyzer/health`

## License
UNLICENSED (private)
