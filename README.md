# TrainerMatch

A production-ready SaaS MVP for matching freelance trainers with educational institutions using AI.

## Architecture Overview

TrainerMatch is built with a modern, scalable architecture:

- **Backend**: Node.js + TypeScript + NestJS with Prisma ORM
- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Database**: PostgreSQL
- **AI Layer**: OpenAI-compatible API wrapper with fallback rule-based matcher
- **Storage**: MinIO (S3-compatible) for document storage
- **Queueing**: BullMQ with Redis for background processing
- **Authentication**: JWT with refresh tokens and RBAC

## Repository Structure

```
trainer-match/
├── backend/                 # NestJS backend API
├── frontend/                # Next.js frontend
├── worker/                  # Background workers (BullMQ)
├── docker/                  # Docker configurations
├── docker-compose.yml       # Local development environment
├── .github/                 # GitHub Actions workflows
└── README.md                # Project documentation
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 16+
- npm or yarn

### Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd trainer-match
   ```

2. Start all services with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the services:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - PgAdmin: http://localhost:5050
   - MinIO Console: http://localhost:9001

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trainermatch

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here

# MinIO/S3
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# AI Service (OpenAI compatible)
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1

# External Services (for notifications)
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

## Core Features

### 1. Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- User roles: Super Admin, Vendor Admin, Vendor User, Trainer

### 2. Matching Engine
- AI-powered trainer matching algorithm
- Scoring based on:
  - Tags overlap (30%)
  - Location proximity (20%)
  - Availability (20%)
  - Budget fit (15%)
  - Ratings (15%)
- REST endpoint: `GET /api/matches/:requirementId`

### 3. Proposal Generation
- AI-generated training proposals
- PDF export functionality
- REST endpoint: `POST /api/requirements/:id/generate-proposal`

### 4. Notification System
- Background workers for processing notifications
- Multi-channel delivery (Email, SMS, WhatsApp)
- Escalation logic for priority trainers

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api`

## Testing

### Unit Tests
Run unit tests with:
```bash
cd backend
npm run test
```

### Integration Tests
Run integration tests with:
```bash
cd backend
npm run test:e2e
```

## Deployment

### Production Considerations

1. **Database**:
   - Use managed PostgreSQL service (AWS RDS, Google Cloud SQL)
   - Enable replication and backups
   - Use connection pooling

2. **Storage**:
   - Use managed S3-compatible service
   - Enable versioning and lifecycle policies
   - Configure CDN for document delivery

3. **Scaling**:
   - Deploy backend services behind load balancer
   - Use auto-scaling groups
   - Implement circuit breaker patterns

4. **Security**:
   - Use HTTPS/TLS for all communications
   - Implement rate limiting
   - Regular security audits and penetration testing

## Sample curl Commands

### 1. Create Vendor & User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vendor.com",
    "password": "securepassword",
    "role": "VENDOR_ADMIN",
    "vendorId": null
  }'
```

### 2. Create Requirement
```bash
curl -X POST http://localhost:3000/requirements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Machine Learning Workshop",
    "description": "3-day intensive workshop on practical ML applications",
    "tags": ["machine-learning", "python", "data-science"],
    "budgetMin": 3000,
    "budgetMax": 5000,
    "startDate": "2023-12-01T09:00:00Z",
    "endDate": "2023-12-03T17:00:00Z",
    "location": "37.7749,-122.4194",
    "collegeId": "college-123"
  }'
```

### 3. Generate Proposal
```bash
curl -X POST http://localhost:3000/requirements/REQ_123/generate-proposal \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 4. Run Matcher
```bash
curl -X GET http://localhost:3000/matches/REQ_123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Start Escalation
```bash
curl -X POST http://localhost:3000/notifications/escalate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trainerId": "TRAINER_123",
    "requirementId": "REQ_123",
    "reason": "No response within 24 hours"
  }'
```

### 6. Trainer Accept Flow
```bash
curl -X POST http://localhost:3000/matches/TRAINER_123/accept \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "requirementId": "REQ_123"
  }'
```

## LLM Prompt Templates

### 1. Requirement Classification
```
Classify the following training requirement:
      
Requirement ID: {requirementId}
Context: {context}
      
Please analyze and categorize this requirement by:
1. Primary subject area
2. Skill level (beginner/intermediate/advanced)
3. Recommended trainer qualifications
4. Estimated duration
```

### 2. Proposal Generation
```
Generate a comprehensive training proposal for the following requirement:
      
Requirement Details:
- Subject: {subject}
- Target Audience: {audience}
- Duration: {duration}
- Budget Range: ${budgetMin}-${budgetMax}
      
Please provide:
1. Detailed module breakdown with learning objectives
2. Timeline and schedule
3. Costing breakdown
4. Terms and conditions
5. Trainer bio and qualifications
```

### 3. Match Explanation
```
Explain why the following trainer is a good match for requirement {requirementId}:
      
Trainer Profile:
- Name: {trainerName}
- Skills: {skills}
- Experience: {experience} years
- Rating: {rating}/5
      
Requirement:
- Topic: {topic}
- Duration: {duration}
- Budget: ${budget}
      
Please explain the match considering:
1. Skills alignment
2. Experience relevance
3. Value proposition
4. Any potential concerns
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.