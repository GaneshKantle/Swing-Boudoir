# Swing Boudoir Backend API

Professional backend API server for the Swing Boudoir Showcase platform, featuring Google OAuth authentication, JWT token management, and comprehensive user management.

## 🚀 Features

- **Google OAuth Integration**: Secure authentication with Google accounts
- **JWT Token Management**: Professional token generation and validation
- **User Profile Management**: Complete user profile CRUD operations
- **Competition System**: Join and manage modeling competitions
- **Voting System**: Vote for models with premium vote support
- **File Upload**: Secure image upload for profile and voting photos
- **Notification System**: Real-time user notifications
- **Prize Management**: Track competition prizes and history
- **Settings Management**: User preferences and account settings
- **Public Profiles**: Shareable model profiles for voting

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Google OAuth credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/swing-boudoir/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=402560830064-ptbui16lhn92pubcv4p9fhtvogipqj05.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

#### Google OAuth Login/Register
```http
POST /api/auth/google
Content-Type: application/json

{
  "idToken": "google_id_token",
  "googleId": "google_user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "profile_picture_url"
}
```

#### Token Refresh
```http
POST /api/auth/refresh
Authorization: Bearer <jwt_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### User Profile Endpoints

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /api/user/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "User biography"
}
```

#### Upload Profile Images
```http
POST /api/user/profile/images
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

images: [file1, file2, ...]
```

#### Delete Image
```http
DELETE /api/user/profile/images/:imageId
Authorization: Bearer <jwt_token>
```

### Competition Endpoints

#### Get User's Competitions
```http
GET /api/competitions/user
Authorization: Bearer <jwt_token>
```

#### Get Available Competitions
```http
GET /api/competitions/available
```

#### Join Competition
```http
POST /api/competitions/:id/join
Authorization: Bearer <jwt_token>
```

#### Get Competition Details
```http
GET /api/competitions/:id
```

### Voting Endpoints

#### Get Voting Statistics
```http
GET /api/votes/stats
```

#### Get Top Voters
```http
GET /api/votes/top-voters
```

#### Get Recent Votes
```http
GET /api/votes/recent
```

#### Get Premium Votes
```http
GET /api/votes/premium
```

### Notification Endpoints

#### Get User Notifications
```http
GET /api/notifications
Authorization: Bearer <jwt_token>
```

#### Mark Notification as Read
```http
POST /api/notifications/:id/read
Authorization: Bearer <jwt_token>
```

#### Mark All Notifications as Read
```http
POST /api/notifications/read-all
Authorization: Bearer <jwt_token>
```

### Prize Endpoints

#### Get Prize History
```http
GET /api/prizes/history
```

#### Get Upcoming Prizes
```http
GET /api/prizes/upcoming
```

#### Get Prize Statistics
```http
GET /api/prizes/stats
```

### Settings Endpoints

#### Get User Settings
```http
GET /api/settings
Authorization: Bearer <jwt_token>
```

#### Update Settings
```http
PUT /api/settings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "notifications": true,
  "privacy": "public"
}
```

#### Change Password
```http
PUT /api/settings/password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### Delete Account
```http
DELETE /api/user/account
Authorization: Bearer <jwt_token>
```

### Public Profile Endpoints

#### Get Public Profile
```http
GET /api/public/profile/:modelId
```

#### Vote for Profile
```http
POST /api/public/profile/:modelId/vote
Content-Type: application/json

{
  "voterId": "voter_user_id",
  "isPremium": false
}
```

### Support Endpoints

#### Submit Support Request
```http
POST /api/support/contact
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "subject": "Support Request",
  "message": "Help message"
}
```

#### Get FAQs
```http
GET /api/support/faq
```

### Health Check
```http
GET /api/health
```

## 🔐 Security Features

- **JWT Token Authentication**: Secure token-based authentication
- **Google OAuth Verification**: Server-side verification of Google tokens
- **CORS Protection**: Configured for specific origins
- **File Upload Security**: File type and size validation
- **Rate Limiting**: Protection against abuse (configured but commented out)
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data

## 🗄️ Data Storage

Currently uses in-memory storage for development. For production, implement:

- **Database**: PostgreSQL, MongoDB, or MySQL
- **File Storage**: AWS S3, Google Cloud Storage, or similar
- **Caching**: Redis for session management
- **Queue System**: For background tasks

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Environment Variables
- `PORT`: Server port (default: 3001)
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend application URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Production Checklist
- [ ] Set secure JWT_SECRET
- [ ] Configure CORS origins
- [ ] Set up database connection
- [ ] Configure file storage
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Configure SSL/TLS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with Google OAuth and basic functionality
- **v1.1.0**: Added comprehensive API endpoints
- **v1.2.0**: Enhanced security and error handling

--- 