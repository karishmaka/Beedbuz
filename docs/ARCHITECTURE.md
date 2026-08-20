# BeedBuzz Architecture

## System Overview

BeedBuzz is built as a modern, scalable social media platform with a microservices-ready architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Web (React)          │     Mobile (React Native)           │
│  (http://localhost:3000) │  (Expo/iOS/Android)              │
└──────────────┬─────────────────────────────────┬────────────┘
               │                                 │
               └────────────────┬────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │   API Gateway        │
                    │ (Express.js Server)  │
                    │ Port: 5000           │
                    └───────────┬──────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼────────┐  ┌───▼─────────┐  ┌─▼────────────┐
        │  Controllers   │  │  Services   │  │ Middleware   │
        │  (Routes)      │  │  (Logic)    │  │ (Auth, etc)  │
        └───────┬────────┘  └───┬─────────┘  └──────────────┘
                │                │
                └────────────────┼──────────────────┐
                                 │                  │
                        ┌────────▼──────────┐ ┌───▼───────────┐
                        │   Databases       │ │  Cache Layer  │
                        ├──────────────────┤ ├───────────────┤
                        │ PostgreSQL        │ │ Redis         │
                        │ (Main DB)         │ │ (Session,     │
                        │                  │ │  Cache)       │
                        └──────────────────┘ └───────────────┘

                        ┌──────────────────┐
                        │ External Services│
                        ├──────────────────┤
                        │ AWS S3 (Storage) │
                        │ Socket.io (RT)   │
                        │ Email Service    │
                        │ SMS Service      │
                        └──────────────────┘
```

## Layered Architecture

### 1. Presentation Layer (Frontend)
- **Web:** React 18 + TypeScript
- **Mobile:** React Native + TypeScript
- Components, pages, navigation
- State management (Redux/Context)

### 2. API Gateway Layer
- Express.js server
- Request routing
- Authentication middleware
- Error handling
- Rate limiting

### 3. Business Logic Layer
- Controllers: Request handling
- Services: Core business logic
- Utilities: Helper functions
- Models: Data structures

### 4. Data Access Layer
- Database models/ORM
- Query builders
- Database migrations

### 5. Data Layer
- PostgreSQL (primary database)
- Redis (caching & sessions)
- AWS S3 (media storage)

## Database Schema Overview

```
users
├── id (PK)
├── email (UNIQUE)
├── phone
├── username (UNIQUE)
├── password_hash
├── profile_picture_url
├── bio
├── taluka
├── village
├── is_business
├── created_at
└── updated_at

posts
├── id (PK)
├── user_id (FK)
├── caption
├── media_urls[]
├── location_taluka
├── location_village
├── hashtags[]
├── likes_count
├── comments_count
├── created_at
└── updated_at

comments
├── id (PK)
├── post_id (FK)
├── user_id (FK)
├── content
├── created_at
└── updated_at

likes
├── id (PK)
├── user_id (FK)
├── post_id (FK)
├── created_at

followers
├── id (PK)
├── follower_id (FK)
├── following_id (FK)
├── created_at

messages
├── id (PK)
├── sender_id (FK)
├── recipient_id (FK)
├── content
├── is_read
├── created_at

stories
├── id (PK)
├── user_id (FK)
├── media_url
├── created_at
└── expires_at

notifications
├── id (PK)
├── user_id (FK)
├── type (like, comment, follow, message)
├── related_user_id
├── related_post_id
├── is_read
└── created_at
```

## API Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── POST /refresh
├── /users
│   ├── GET /:id
│   ├── PUT /:id
│   ├── GET /:id/posts
│   └── GET /:id/followers
├── /posts
│   ├── GET (feed)
│   ├── POST (create)
│   ├── GET /:id
│   ├── DELETE /:id
│   └── POST /:id/like
├── /comments
│   ├── POST (create)
│   ├── DELETE /:id
│   └── POST /:id/like
├── /stories
│   ├── GET
│   ├── POST (create)
│   └── DELETE /:id
├── /messages
│   ├── GET (inbox)
│   ├── POST (send)
│   └── GET /:conversationId
├── /notifications
│   ├── GET
│   ├── PUT /:id/read
│   └── DELETE /:id
└── /search
    ├── GET /users
    ├── GET /posts
    └── GET /hashtags
```

## Technology Stack Details

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4
- **Language:** TypeScript
- **ORM:** Sequelize/TypeORM
- **Authentication:** JWT + bcrypt
- **Validation:** Joi/Zod
- **Logging:** Winston
- **Testing:** Jest + Supertest

### Frontend (Web)
- **Framework:** React 18
- **State:** Redux Toolkit
- **UI:** Material-UI / Tailwind CSS
- **Routing:** React Router v6
- **HTTP:** Axios
- **Real-time:** Socket.io-client
- **Forms:** React Hook Form
- **Testing:** Jest + React Testing Library

### Frontend (Mobile)
- **Framework:** React Native
- **Navigation:** React Navigation
- **State:** Redux Toolkit
- **HTTP:** Axios
- **Real-time:** Socket.io-client
- **Camera:** react-native-camera-kit
- **Storage:** AsyncStorage

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Docker Compose (dev), Kubernetes (production)
- **Hosting:** AWS (EC2, RDS, S3, CloudFront)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, CloudWatch
- **CDN:** CloudFront

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────┐
│     CloudFlare / CDN                    │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼──────────┐
        │  Application Load │
        │     Balancer      │
        │    (AWS ELB)      │
        └────────┬──────────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
   ┌──▼──┐  ┌───▼───┐  ┌──▼──┐
   │ App │  │ App   │  │ App │
   │ 1   │  │ 2     │  │ 3   │
   │(EC2)│  │(EC2)  │  │(EC2)│
   └──┬──┘  └───┬───┘  └──┬──┘
      │         │         │
      └─────────┼─────────┘
                │
        ┌───────▼───────┐
        │   RDS (PostgreSQL) │
        │   Multi-AZ    │
        │   Replicas    │
        └───────────────┘

        ┌───────────────┐
        │ ElastiCache   │
        │   (Redis)     │
        │   Cluster     │
        └───────────────┘

        ┌───────────────┐
        │   S3 Bucket   │
        │  (Media)      │
        └───────────────┘
```

## Real-time Features

### WebSocket Events
- `notification:new` - New notification
- `message:new` - New direct message
- `post:like` - Someone liked your post
- `post:comment` - Someone commented
- `user:follow` - Someone followed you
- `user:online` - User online status
- `story:new` - New story from followed user

## Security Measures

1. **Authentication:** JWT with refresh tokens
2. **Authorization:** Role-based access control (RBAC)
3. **Encryption:** HTTPS, data encryption at rest
4. **Input Validation:** Server-side validation for all inputs
5. **Rate Limiting:** API rate limiting to prevent abuse
6. **CORS:** Configured CORS for security
7. **CSRF Protection:** CSRF tokens for state-changing operations
8. **SQL Injection Prevention:** Parameterized queries via ORM
9. **XSS Protection:** Input sanitization, output encoding
10. **DDoS Protection:** CloudFlare/AWS Shield

## Scalability Strategy

- **Horizontal Scaling:** Load balancing across multiple instances
- **Database Replication:** Read replicas for query scaling
- **Caching:** Redis for session and data caching
- **CDN:** CloudFront for static assets
- **Message Queue:** Bull/RabbitMQ for async tasks
- **Microservices Ready:** Architecture supports service separation

---

For more details, see other documentation files.