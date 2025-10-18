# MapMyVid 🗺️

A comprehensive video analysis platform that extracts location data from travel videos using AI and Google Maps integration. Transform your travel memories into interactive journey maps with intelligent location detection and route visualization.

## 🏗️ Project Architecture

This monorepo contains two main applications:

### 📱 Frontend (`map-my-vid-frontend`)
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** for styling
- **Google Maps JavaScript API** integration
- **Multi-language support** (Vietnamese, English, Japanese, Korean, Spanish, Chinese)
- Interactive map visualization with drag-and-drop route planning
- Video upload and management interface

### 🔧 Backend (`map-my-vid-backend`)
- **NestJS** + **TypeScript**
- **Prisma** + **PostgreSQL** database
- **JWT Authentication** with role-based access control
- **Google Gemini AI** for video analysis
- **AWS S3** integration for file storage
- **Swagger API documentation**
- **Docker** support with multi-stage builds

## ✨ Key Features

### 🎬 Video Processing
- Upload travel videos with automatic AI analysis
- Extract location data using Google Gemini AI
- Store videos securely in AWS S3
- Process multiple video formats (MP4, AVI, MOV, WMV)

### 🗺️ Interactive Mapping
- **Google Maps Integration** with custom markers
- **Journey Visualization** with connected route lines
- **Drag & Drop Reordering** of travel stops
- **Auto-fit Bounds** for optimal map viewing
- **Export to Google Maps** for navigation

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (User, Admin, Super Admin)
- Secure API endpoints with guards
- Environment-based configuration

### 📊 Location Management
- CRUD operations for locations
- User-specific location collections
- Rich location details and metadata
- Admin dashboard for user management

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 20
- **PostgreSQL** database
- **Google Maps API Key**
- **Google Gemini API Key**
- **AWS S3** credentials

### Environment Setup

Create `.env` files in both frontend and backend directories:

#### Frontend (`map-my-vid-frontend/.env`)
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Backend (`map-my-vid-backend/.env`)
```env
# App Configuration
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mapmyvid?schema=public

# Google Services
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key

# AWS S3
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
```

### Installation & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mapmyvid.git
   cd mapmyvid
   ```

2. **Setup Backend**
   ```bash
   cd map-my-vid-backend
   npm install
   npm run prisma:generate
   npm run prisma:migrate:dev
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd map-my-vid-frontend
   yarn install
   yarn dev
   ```

4. **Access the applications**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api/docs`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Start both frontend and backend with database
docker compose up --build
```

### Individual Docker Builds
```bash
# Backend
cd map-my-vid-backend
docker build -t mapmyvid-backend .
docker run --env-file .env -p 3000:4000 mapmyvid-backend

# Frontend
cd map-my-vid-frontend
docker build -t mapmyvid-frontend .
docker run -p 5173:5173 mapmyvid-frontend
```

## 📁 Project Structure

```
MapMyVid/
├── map-my-vid-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Application pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── api/                 # API integration
│   │   ├── i18n/                # Internationalization
│   │   └── utils/               # Utility functions
│   ├── public/                  # Static assets
│   └── package.json
├── map-my-vid-backend/           # NestJS backend application
│   ├── src/
│   │   ├── modules/             # Feature modules
│   │   │   ├── auth/            # Authentication
│   │   │   ├── users/           # User management
│   │   │   ├── video-analyzer/  # AI video analysis
│   │   │   ├── locations/       # Location CRUD
│   │   │   └── admin/           # Admin panel
│   │   ├── common/              # Shared utilities
│   │   ├── database/            # Prisma configuration
│   │   └── config/              # App configuration
│   ├── prisma/                  # Database schema & migrations
│   └── package.json
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

## 🛠️ Technologies Used

### Frontend Stack
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **@react-google-maps/api** - Google Maps integration

### Backend Stack
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Modern database toolkit
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Token authentication
- **Swagger** - API documentation
- **AWS S3** - File storage
- **Google Gemini AI** - Video analysis
- **Google Maps API** - Location services

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📚 API Documentation

The backend provides comprehensive API documentation via Swagger:
- **Development**: `http://localhost:3000/api/docs`
- **Production**: `https://your-domain.com/api/docs`

### Key API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/video-analyzer/upload` - Video upload and analysis
- `GET /api/locations` - Get user locations
- `POST /api/locations` - Create new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

## 🔒 Security Features

- **JWT Authentication** with configurable expiration
- **Role-based Access Control** (RBAC)
- **Input validation** with DTOs
- **SQL injection protection** via Prisma
- **CORS configuration** for cross-origin requests
- **Environment variable** management
- **Helmet** security headers

## 🌍 Internationalization

The frontend supports multiple languages:
- 🇻🇳 Vietnamese
- 🇺🇸 English
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇪🇸 Spanish
- 🇨🇳 Chinese

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Use conventional commit messages
- Ensure code passes ESLint and Prettier checks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps Platform** - Robust mapping APIs
- **Google Gemini AI** - Advanced video analysis capabilities
- **NestJS Community** - Excellent framework and documentation
- **React Community** - Comprehensive ecosystem
- **Prisma Team** - Modern database toolkit

---

**Made with ❤️ by the MapMyVid Team**

*Transform your travel videos into intelligent journey maps*
