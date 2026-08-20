# BeedBuzz Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Redis 7+
- Git
- Docker & Docker Compose (optional but recommended)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/karishmaka/BeedBuzz.git
cd BeedBuzz
```

### 2. Setup with Docker (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Backend API server

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env

# Configure .env with your settings
# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Start development server
npm run dev
```

Backend will run at: `http://localhost:5000`

### 4. Setup Web Frontend

```bash
cd ../web
npm install
cp .env.example .env

# Configure .env with API URL
npm run dev
```

Web app will run at: `http://localhost:3000`

### 5. Setup Mobile App

```bash
cd ../mobile
npm install
cp .env.example .env

# Configure .env with API URL
npm run dev
```

Use Expo Go or emulator to run the mobile app.

## Environment Variables

Create `.env` files in each directory with required variables:

### Backend .env
```
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beedbuzz
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# AWS
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=beedbuzz-media

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Web .env
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Mobile .env
```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Verify Installation

1. **Check Backend:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check Web:**
   Open http://localhost:3000 in browser

3. **Check Database:**
   ```bash
   psql -U postgres -d beedbuzz -c "SELECT version();"
   ```

## Next Steps

- Read [API.md](./API.md) for API endpoints
- Check [FEATURES.md](./FEATURES.md) for feature details
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

## Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database connection error
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify connection string in .env
```

### Redis connection error
```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

For more issues, please open a GitHub issue.