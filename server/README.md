# Bookmark App Backend

Node.js/Express backend server for the Bookmark App. Handles URL preview fetching, link management, and authentication with Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
cd server
npm install
```

### Environment Setup

Copy `env.example` to `.env` and fill in your values:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20

# CORS
CORS_ORIGIN=http://localhost:8081,http://localhost:19006
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in the Supabase SQL editor
3. Copy your project URL and keys to the `.env` file

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

## 📚 API Reference

### Base URL
```
http://localhost:3001/api
```

### Authentication
All protected endpoints require a `Bearer` token in the Authorization header:
```
Authorization: Bearer <supabase_access_token>
```

### Endpoints

#### Health Check
```http
GET /api/healthz
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

#### Preview URL
```http
POST /api/links/preview
Content-Type: application/json

{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "url": "https://example.com",
  "title": "Example Page",
  "description": "This is an example page",
  "image": "https://example.com/image.jpg",
  "site": "example.com"
}
```

**Rate Limited:** 20 requests per minute

#### Create Link (Auth Required)
```http
POST /api/links
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com",
  "title": "Example Page",
  "description": "This is an example page",
  "image": "https://example.com/image.jpg",
  "tags": ["reading", "tech"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "url": "https://example.com",
  "title": "Example Page",
  "description": "This is an example page",
  "image": "https://example.com/image.jpg",
  "tags": ["reading", "tech"],
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Get Links (Auth Required)
```http
GET /api/links?page=1&pageSize=20&search=example&tag=tech
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20, max: 100) - Items per page
- `search` (string, optional) - Search in title, description, or URL
- `tag` (string, optional) - Filter by tag

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "user_id": "user_uuid",
      "url": "https://example.com",
      "title": "Example Page",
      "description": "This is an example page",
      "image": "https://example.com/image.jpg",
      "tags": ["reading", "tech"],
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

#### Delete Link (Auth Required)
```http
DELETE /api/links/:id
Authorization: Bearer <token>
```

**Response:** `204 No Content`

## 🔒 Security

### Authentication
- JWT tokens validated via Supabase Auth API
- Row Level Security (RLS) policies ensure users only access their own data
- Automatic token refresh handling

### Rate Limiting
- Preview endpoint: 20 requests per minute per IP
- Configurable via environment variables

### Input Validation
- All inputs validated with Zod schemas
- URL format validation
- Content length limits

### CORS
- Configured for specific origins
- Credentials support enabled

## 🏗️ Architecture

```
src/
├── index.ts              # Server entry point
├── types/                # TypeScript interfaces
├── routes/               # API route handlers
│   └── links.ts         # Link management endpoints
├── services/             # Business logic
│   ├── linkPreview.ts   # URL metadata extraction
│   └── links.ts         # Database operations
├── middleware/           # Express middleware
│   └── auth.ts          # Authentication middleware
└── utils/               # Utilities
    └── supabase.ts      # Supabase client & helpers
```

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

### Environment Variables
Ensure all environment variables are set in production:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PORT`
- `NODE_ENV=production`
- `CORS_ORIGIN` (your frontend domain)

### Build
```bash
npm run build
```

### Platforms
- **Vercel**: Deploy with `vercel --prod`
- **Railway**: Connect GitHub repository
- **Heroku**: Use Procfile and deploy
- **Docker**: Use provided Dockerfile

## 🔧 Configuration

### Rate Limiting
Adjust rate limits in `.env`:
```env
RATE_LIMIT_WINDOW_MS=60000  # 1 minute
RATE_LIMIT_MAX_REQUESTS=20  # 20 requests per window
```

### CORS
Configure allowed origins:
```env
CORS_ORIGIN=https://yourapp.com,https://admin.yourapp.com
```

### Database
The server uses Supabase for:
- User authentication
- Data storage
- Row Level Security

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Check `CORS_ORIGIN` environment variable
- Ensure frontend URL is included

**Authentication Errors**
- Verify Supabase credentials
- Check JWT token expiration
- Ensure RLS policies are configured

**Rate Limiting**
- Check rate limit configuration
- Monitor request frequency

**URL Preview Failures**
- Check network connectivity
- Verify URL accessibility
- Review server logs for errors

### Logs
Enable debug logging:
```env
NODE_ENV=development
DEBUG=app:*
```

## 📄 License

MIT License
