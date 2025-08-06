# Backend CORS Configuration

## For the Backend Admin

To make the frontend work in both localhost and production environments, you need to configure CORS on your backend server.

### Express.js Backend Example

```javascript
const cors = require('cors');

// Configure CORS to accept both localhost and production origins
app.use(cors({
  origin: [
    'http://localhost:8080',    // Frontend development
    'http://localhost:3000',    // Alternative frontend port
    'http://localhost:5173',    // Vite default port
    'https://your-production-domain.com',  // Production frontend
    'https://swingboudoir.com'  // Your production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Environment-Based Configuration

```javascript
// .env file
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
PRODUCTION_FRONTEND_URL=https://your-production-domain.com

// server.js
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.PRODUCTION_FRONTEND_URL]
  : [
      'http://localhost:8080',
      'http://localhost:3000', 
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### For Better Auth API

If you're using Better Auth, make sure your callback URLs are configured to accept both environments:

```javascript
// Better Auth configuration
const betterAuthConfig = {
  // ... other config
  callbacks: {
    // Allow both localhost and production URLs
    allowedCallbackUrls: [
      'http://localhost:8080/verify-email',
      'http://localhost:8080/reset-password',
      'http://localhost:8080/dashboard',
      'https://your-production-domain.com/verify-email',
      'https://your-production-domain.com/reset-password',
      'https://your-production-domain.com/dashboard'
    ]
  }
};
```

## Testing

1. **Localhost Testing**: Frontend should work on `http://localhost:8080`
2. **Production Testing**: Frontend should work on your production domain
3. **No Code Changes**: The frontend will automatically detect the environment

## Current Frontend Configuration

The frontend now:
- ✅ **Always uses live API server**: `https://api.swingboudoirmag.com/api/v1/`
- ✅ **Works on localhost**: CORS configured to accept `localhost:8080`
- ✅ **Works in production**: Same API endpoints
- ✅ **Dynamic callback URLs**: Uses current origin for callbacks
- ✅ **No code changes needed** between environments

### Testing
- **Localhost**: `http://localhost:8080` → calls `https://api.swingboudoirmag.com/api/v1/`
- **Production**: `https://your-domain.com` → calls `https://api.swingboudoirmag.com/api/v1/` 