# BeedBuzz API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register new user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "+919876543210",
  "username": "beedbuzz_user",
  "taluka": "Beed",
  "village": "Beedwad"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /auth/login
Login user

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### POST /auth/logout
Logout user (Protected)

#### POST /auth/refresh
Refresh JWT token

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

### Users

#### GET /users/:id
Get user profile

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "beedbuzz_user",
    "email": "user@example.com",
    "profilePicture": "url",
    "bio": "User bio",
    "taluka": "Beed",
    "village": "Beedwad",
    "isBusinessAccount": false,
    "followersCount": 150,
    "followingCount": 80,
    "postsCount": 42,
    "createdAt": "2024-01-01T00:00:00Z",
    "isFollowing": false
  }
}
```

#### PUT /users/:id
Update user profile (Protected)

**Request Body:**
```json
{
  "bio": "Updated bio",
  "profilePicture": "image_url"
}
```

#### GET /users/:id/posts
Get user's posts

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

#### GET /users/:id/followers
Get user's followers

#### GET /users/:id/following
Get user's following list

#### POST /users/:id/follow
Follow user (Protected)

#### DELETE /users/:id/follow
Unfollow user (Protected)

#### POST /users/search
Search users

**Query Parameters:**
- `q`: Search query
- `taluka`: Filter by taluka (optional)
- `village`: Filter by village (optional)

### Posts

#### GET /posts
Get feed posts (Protected)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `taluka`: Filter by taluka
- `village`: Filter by village

#### POST /posts
Create post (Protected)

**Request Body (form-data):**
```
caption: string
media: files[]
taluka: string
village: string
hashtags: string[]
location: string
```

#### GET /posts/:id
Get post details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "user": { ... },
    "caption": "Post caption",
    "media": ["url1", "url2"],
    "taluka": "Beed",
    "village": "Beedwad",
    "hashtags": ["#beed", "#city"],
    "likesCount": 42,
    "commentsCount": 8,
    "isLiked": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /posts/:id
Delete post (Protected, owner only)

#### POST /posts/:id/like
Like post (Protected)

#### DELETE /posts/:id/like
Unlike post (Protected)

### Comments

#### POST /posts/:postId/comments
Create comment (Protected)

**Request Body:**
```json
{
  "content": "Comment text"
}
```

#### GET /posts/:postId/comments
Get post comments

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page

#### DELETE /comments/:id
Delete comment (Protected, owner only)

#### POST /comments/:id/like
Like comment (Protected)

### Stories

#### POST /stories
Create story (Protected)

**Request Body (form-data):**
```
media: file
caption: string (optional)
taluka: string
village: string
```

#### GET /stories
Get stories from followed users (Protected)

#### GET /stories/:userId
Get user's stories

#### DELETE /stories/:id
Delete story (Protected, owner only)

#### POST /stories/:id/view
Mark story as viewed (Protected)

### Messages

#### GET /messages
Get user's conversations (Protected)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page

#### POST /messages
Start conversation or send message (Protected)

**Request Body:**
```json
{
  "recipientId": "uuid",
  "content": "Message text"
}
```

#### GET /messages/:conversationId
Get conversation messages (Protected)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page

#### DELETE /messages/:messageId
Delete message (Protected, sender only)

### Notifications

#### GET /notifications
Get user notifications (Protected)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `unreadOnly`: Boolean (default: false)

#### PUT /notifications/:id/read
Mark notification as read (Protected)

#### DELETE /notifications/:id
Delete notification (Protected)

### Search

#### GET /search/users
Search users

**Query Parameters:**
- `q`: Search query
- `taluka`: Filter by taluka

#### GET /search/posts
Search posts

**Query Parameters:**
- `q`: Search query
- `taluka`: Filter by taluka
- `hashtag`: Filter by hashtag

#### GET /search/hashtags
Search hashtags

**Query Parameters:**
- `q`: Search query

### Locations

#### GET /locations/talukas
Get all talukas

#### GET /locations/talukas/:name/villages
Get villages in taluka

#### GET /locations/:taluka/posts
Get posts from location

## WebSocket Events

### Emit Events
```javascript
// Connection
socket.emit('connect', { userId, token })

// Notifications
socket.emit('notification:read', { notificationId })

// Messaging
socket.emit('message:send', { recipientId, content })
socket.emit('message:typing', { recipientId })

// Stories
socket.emit('story:view', { storyId })
```

### Listen Events
```javascript
// Notifications
socket.on('notification:new', (data) => {})
socket.on('notification:update', (data) => {})

// Messaging
socket.on('message:new', (data) => {})
socket.on('message:typing', (data) => {})
socket.on('user:online', (data) => {})
socket.on('user:offline', (data) => {})

// Social
socket.on('post:like', (data) => {})
socket.on('post:comment', (data) => {})
socket.on('user:follow', (data) => {})
socket.on('story:new', (data) => {})
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_CREDENTIALS | 401 | Invalid email or password |
| TOKEN_EXPIRED | 401 | JWT token expired |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | No permission |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE_EMAIL | 409 | Email already exists |
| VALIDATION_ERROR | 400 | Input validation failed |
| INTERNAL_ERROR | 500 | Server error |

## Rate Limiting

API endpoints have rate limits:
- Public endpoints: 100 requests/hour
- Authenticated endpoints: 1000 requests/hour
- File uploads: 50 requests/hour

---

For more details, see other documentation files.