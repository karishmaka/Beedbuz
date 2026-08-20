# BeedBuzz Deployment Guide

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] CDN configured
- [ ] Email service configured
- [ ] SMS service configured
- [ ] AWS S3 bucket created
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Domain configured

## Production Environment Setup

### 1. AWS Account Setup

```bash
# Create IAM user
# Create S3 bucket for media
# Create RDS PostgreSQL instance
# Create ElastiCache Redis cluster
# Create VPC and security groups
```

### 2. Environment Variables

Create `.env.production`:

```bash
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_NAME=beedbuzz_prod
DB_USER=postgres
DB_PASSWORD=strong_password

# Redis
REDIS_HOST=your-redis-endpoint.amazonaws.com
REDIS_PORT=6379

# JWT
JWT_SECRET=very_long_random_secret_key
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=another_long_random_secret

# AWS
AWS_ACCESS_KEY_ID=your_key_id
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=beedbuzz-prod-media

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_key
FROM_EMAIL=noreply@beedbuzz.local

# SMS
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# URLs
API_URL=https://api.beedbuzz.local
WEB_URL=https://beedbuzz.local
MOBILE_DEEP_LINK=beedbuzz://

# Sentry (Error tracking)
SENTRY_DSN=your_sentry_dsn

# Payment
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret
```

## Docker Deployment

### Build Docker Images

```bash
# Build backend image
cd backend
docker build -t beedbuzz-api:latest .

# Build web image
cd ../web
docker build -t beedbuzz-web:latest .
```

### Push to Docker Registry

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin your_ecr_uri

# Tag images
docker tag beedbuzz-api:latest your_ecr_uri/beedbuzz-api:latest
docker tag beedbuzz-web:latest your_ecr_uri/beedbuzz-web:latest

# Push images
docker push your_ecr_uri/beedbuzz-api:latest
docker push your_ecr_uri/beedbuzz-web:latest
```

## AWS ECS Deployment

### 1. Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name beedbuzz-prod
```

### 2. Create Task Definitions

Create `ecs-task-definition.json`:

```json
{
  "family": "beedbuzz-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "beedbuzz-api",
      "image": "your_ecr_uri/beedbuzz-api:latest",
      "portMappings": [{
        "containerPort": 5000
      }],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/beedbuzz-api",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 3. Create Service

```bash
aws ecs create-service \
  --cluster beedbuzz-prod \
  --service-name beedbuzz-api \
  --task-definition beedbuzz-api:1 \
  --desired-count 3 \
  --launch-type FARGATE \
  --load-balancers targetGroupArn=arn:aws:...,containerName=beedbuzz-api,containerPort=5000 \
  --network-configuration awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}
```

## Database Migration (Production)

```bash
# Connect to production database
export DB_HOST=your-rds-endpoint.amazonaws.com
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_NAME=beedbuzz_prod

# Run migrations
cd backend
npm run migrate:prod

# Seed data (optional)
npm run seed:prod
```

## SSL/TLS Setup

### Using AWS Certificate Manager

```bash
# Request certificate
aws acm request-certificate \
  --domain-name beedbuzz.local \
  --subject-alternative-names api.beedbuzz.local \
  --validation-method DNS
```

### Configure CloudFront

1. Go to CloudFront in AWS Console
2. Create distribution
3. Set origin to your ELB
4. Set certificate from ACM
5. Configure caching behaviors
6. Enable compression

## CDN & Image Optimization

### CloudFront Distribution

```
Origin: S3 bucket (beedbuzz-prod-media)
Behaviors:
  - /api/*: Forward to ALB
  - /images/*: S3 bucket with caching
  - /videos/*: S3 bucket with streaming
Compression: Enabled
Cache Policy: Optimized for web apps
```

## Monitoring & Logging

### CloudWatch

```bash
# Create log groups
aws logs create-log-group --log-group-name /beedbuzz/api
aws logs create-log-group --log-group-name /beedbuzz/web
aws logs create-log-group --log-group-name /beedbuzz/database
```

### Sentry Integration

```javascript
// backend/src/config/sentry.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

module.exports = Sentry;
```

### Metrics & Alerts

CloudWatch Alarms:
- CPU > 70%
- Memory > 80%
- Error rate > 1%
- API latency > 1000ms
- Database connection pool exhausted

## Database Backups

### Automated Backups

```bash
# RDS automatic backups (AWS Console)
# Retention: 30 days
# Backup window: 03:00 UTC
```

### Manual Backup

```bash
pg_dump -h your-rds-endpoint -U postgres -d beedbuzz_prod > backup.sql

# Upload to S3
aws s3 cp backup.sql s3://beedbuzz-backups/
```

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build images
        run: |
          docker build -t beedbuzz-api:${{ github.sha }} backend/
          docker build -t beedbuzz-web:${{ github.sha }} web/
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker push $ECR_REGISTRY/beedbuzz-api:${{ github.sha }}
          docker push $ECR_REGISTRY/beedbuzz-web:${{ github.sha }}
      
      - name: Update ECS service
        run: |
          aws ecs update-service --cluster beedbuzz-prod --service beedbuzz-api --force-new-deployment
```

## Domain Configuration

### DNS Setup

```
beedbuzz.local          -> CloudFront distribution
api.beedbuzz.local      -> ALB endpoint
mobile.beedbuzz.local   -> Mobile app deep link
www.beedbuzz.local      -> Web app
```

## Performance Optimization

### Caching Strategy
- Redis: Session, user data, post cache
- CloudFront: Static assets, images, videos
- Database: Query caching via ORM

### Database Optimization
- Indexes on frequently queried columns
- Query optimization and monitoring
- Read replicas for scaling
- Connection pooling

## Security Hardening

### Network Security
- VPC with private subnets
- Security groups with least privilege
- WAF (Web Application Firewall)
- DDoS protection via CloudFlare

### Application Security
- Secrets manager for credentials
- API key rotation
- HTTPS/TLS everywhere
- Rate limiting and throttling

## Rollback Procedure

```bash
# If deployment fails:
aws ecs update-service \
  --cluster beedbuzz-prod \
  --service beedbuzz-api \
  --task-definition beedbuzz-api:previous_version
```

## Post-Deployment Checklist

- [ ] Health checks passing
- [ ] API responding correctly
- [ ] Database connectivity verified
- [ ] Redis cache working
- [ ] File uploads working
- [ ] Email sending working
- [ ] Notifications working
- [ ] WebSocket connections working
- [ ] Monitoring alerts active
- [ ] Backups running

---

For more help, see [SETUP.md](./SETUP.md) and [ARCHITECTURE.md](./ARCHITECTURE.md)