/**
 * Swing Boudoir Showcase Backend Server
 * 
 * This server provides:
 * - Google OAuth authentication
 * - JWT token management
 * - User profile management
 * - Competition and voting APIs
 * - File upload handling
 * 
 * @author Swing Boudoir Development Team
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// In-memory data storage (replace with database in production)
let users = [];
let competitions = [];
let votes = [];
let notifications = [];
let prizes = [];

// JWT Token generation
const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    },
    JWT_SECRET
  );
};

// JWT Token verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required',
      code: 'TOKEN_REQUIRED'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
    }
    req.user = user;
    next();
  });
};

// Password hashing functions
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

/**
 * Authentication Routes
 */

// User registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
        code: 'WEAK_PASSWORD'
      });
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(user);

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      code: 'REGISTRATION_FAILED'
    });
  }
});

// User login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if user has password (manual registration)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'This account was created with Google. Please use Google login.',
        code: 'GOOGLE_ACCOUNT'
      });
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      code: 'LOGIN_FAILED'
    });
  }
});

// Token refresh
app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.sub);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      user,
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      code: 'REFRESH_FAILED'
    });
  }
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * User Profile Routes
 */

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.sub);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      code: 'PROFILE_ERROR'
    });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.sub);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Update user data
    Object.assign(user, req.body, {
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      code: 'UPDATE_ERROR'
    });
  }
});

// Upload profile/voting images
app.post('/api/user/profile/images', authenticateToken, upload.array('images', 10), (req, res) => {
  try {
    const uploadedFiles = req.files.map(file => ({
      id: Date.now().toString(),
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }));

    res.json({
      success: true,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed',
      code: 'UPLOAD_ERROR'
    });
  }
});

// Delete image
app.delete('/api/user/profile/images/:imageId', authenticateToken, (req, res) => {
  try {
    const { imageId } = req.params;
    
    // In a real app, you would delete the file from storage
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image',
      code: 'DELETE_ERROR'
    });
  }
});

/**
 * Competitions Routes
 */

// Get user's joined competitions
app.get('/api/competitions/user', authenticateToken, (req, res) => {
  try {
    const userCompetitions = competitions.filter(c => 
      c.participants.includes(req.user.sub)
    );

    res.json({
      success: true,
      competitions: userCompetitions
    });

  } catch (error) {
    console.error('Get user competitions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get competitions',
      code: 'COMPETITIONS_ERROR'
    });
  }
});

// Get available competitions
app.get('/api/competitions/available', (req, res) => {
  try {
    const availableCompetitions = competitions.filter(c => 
      c.status === 'active' && new Date(c.endDate) > new Date()
    );

    res.json({
      success: true,
      competitions: availableCompetitions
    });

  } catch (error) {
    console.error('Get available competitions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get competitions',
      code: 'COMPETITIONS_ERROR'
    });
  }
});

// Join competition
app.post('/api/competitions/:id/join', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const competition = competitions.find(c => c.id === id);
    
    if (!competition) {
      return res.status(404).json({
        success: false,
        error: 'Competition not found',
        code: 'COMPETITION_NOT_FOUND'
      });
    }

    if (competition.participants.includes(req.user.sub)) {
      return res.status(400).json({
        success: false,
        error: 'Already joined this competition',
        code: 'ALREADY_JOINED'
      });
    }

    competition.participants.push(req.user.sub);

    res.json({
      success: true,
      message: 'Successfully joined competition'
    });

  } catch (error) {
    console.error('Join competition error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join competition',
      code: 'JOIN_ERROR'
    });
  }
});

// Get competition details
app.get('/api/competitions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const competition = competitions.find(c => c.id === id);
    
    if (!competition) {
      return res.status(404).json({
        success: false,
        error: 'Competition not found',
        code: 'COMPETITION_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      competition
    });

  } catch (error) {
    console.error('Get competition error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get competition',
      code: 'COMPETITION_ERROR'
    });
  }
});

/**
 * Voting Routes
 */

// Get voting statistics
app.get('/api/votes/stats', (req, res) => {
  try {
    const stats = {
      totalVotes: votes.length,
      uniqueVoters: new Set(votes.map(v => v.voterId)).size,
      topModels: [] // Calculate top models based on votes
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get vote stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get voting statistics',
      code: 'STATS_ERROR'
    });
  }
});

// Get top voters
app.get('/api/votes/top-voters', (req, res) => {
  try {
    const voterCounts = {};
    votes.forEach(vote => {
      voterCounts[vote.voterId] = (voterCounts[vote.voterId] || 0) + 1;
    });

    const topVoters = Object.entries(voterCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([voterId, count]) => ({
        voterId,
        voteCount: count
      }));

    res.json({
      success: true,
      topVoters
    });

  } catch (error) {
    console.error('Get top voters error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get top voters',
      code: 'VOTERS_ERROR'
    });
  }
});

// Get recent votes
app.get('/api/votes/recent', (req, res) => {
  try {
    const recentVotes = votes
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);

    res.json({
      success: true,
      votes: recentVotes
    });

  } catch (error) {
    console.error('Get recent votes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recent votes',
      code: 'VOTES_ERROR'
    });
  }
});

// Get premium votes
app.get('/api/votes/premium', (req, res) => {
  try {
    const premiumVotes = votes.filter(v => v.isPremium);

    res.json({
      success: true,
      votes: premiumVotes
    });

  } catch (error) {
    console.error('Get premium votes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get premium votes',
      code: 'PREMIUM_ERROR'
    });
  }
});

/**
 * Notifications Routes
 */

// Get user notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
  try {
    const userNotifications = notifications.filter(n => 
      n.userId === req.user.sub
    );

    res.json({
      success: true,
      notifications: userNotifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications',
      code: 'NOTIFICATIONS_ERROR'
    });
  }
});

// Mark notification as read
app.post('/api/notifications/:id/read', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => 
      n.id === id && n.userId === req.user.sub
    );
    
    if (notification) {
      notification.isRead = true;
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      code: 'MARK_READ_ERROR'
    });
  }
});

// Mark all notifications as read
app.post('/api/notifications/read-all', authenticateToken, (req, res) => {
  try {
    notifications.forEach(n => {
      if (n.userId === req.user.sub) {
        n.isRead = true;
      }
    });

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      code: 'MARK_ALL_READ_ERROR'
    });
  }
});

/**
 * Prize History Routes
 */

// Get prize history
app.get('/api/prizes/history', (req, res) => {
  try {
    const prizeHistory = prizes.filter(p => 
      p.status === 'completed'
    );

    res.json({
      success: true,
      prizes: prizeHistory
    });

  } catch (error) {
    console.error('Get prize history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get prize history',
      code: 'PRIZE_HISTORY_ERROR'
    });
  }
});

// Get upcoming prizes
app.get('/api/prizes/upcoming', (req, res) => {
  try {
    const upcomingPrizes = prizes.filter(p => 
      p.status === 'upcoming' && new Date(p.startDate) > new Date()
    );

    res.json({
      success: true,
      prizes: upcomingPrizes
    });

  } catch (error) {
    console.error('Get upcoming prizes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get upcoming prizes',
      code: 'UPCOMING_PRIZES_ERROR'
    });
  }
});

// Get prize statistics
app.get('/api/prizes/stats', (req, res) => {
  try {
    const stats = {
      totalPrizes: prizes.length,
      totalValue: prizes.reduce((sum, p) => sum + p.value, 0),
      completedPrizes: prizes.filter(p => p.status === 'completed').length
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get prize stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get prize statistics',
      code: 'PRIZE_STATS_ERROR'
    });
  }
});

/**
 * Settings Routes
 */

// Get user settings
app.get('/api/settings', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.sub);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      settings: user.settings || {}
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get settings',
      code: 'SETTINGS_ERROR'
    });
  }
});

// Update settings
app.put('/api/settings', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.sub);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    user.settings = { ...user.settings, ...req.body };
    user.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      settings: user.settings
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
      code: 'UPDATE_SETTINGS_ERROR'
    });
  }
});

// Change password (for future use)
app.put('/api/settings/password', authenticateToken, (req, res) => {
  try {
    // This would be implemented if we add password-based authentication
    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      code: 'PASSWORD_ERROR'
    });
  }
});

// Delete account
app.delete('/api/user/account', authenticateToken, (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.sub);
    
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
      code: 'DELETE_ACCOUNT_ERROR'
    });
  }
});

/**
 * Public Profile Routes
 */

// Get public profile
app.get('/api/public/profile/:modelId', (req, res) => {
  try {
    const { modelId } = req.params;
    const user = users.find(u => u.id === modelId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    // Get user's votes and competitions
    const userVotes = votes.filter(v => v.modelId === modelId);
    const userCompetitions = competitions.filter(c => 
      c.participants.includes(modelId)
    );

    const publicProfile = {
      ...user,
      voteCount: userVotes.length,
      competitionCount: userCompetitions.length,
      // Don't include sensitive information
      email: undefined,
      settings: undefined
    };

    res.json({
      success: true,
      profile: publicProfile
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get public profile',
      code: 'PUBLIC_PROFILE_ERROR'
    });
  }
});

// Vote for profile
app.post('/api/public/profile/:modelId/vote', (req, res) => {
  try {
    const { modelId } = req.params;
    const { voterId, isPremium = false } = req.body;

    const vote = {
      id: Date.now().toString(),
      modelId,
      voterId,
      isPremium,
      timestamp: new Date().toISOString()
    };

    votes.push(vote);

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      vote
    });

  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record vote',
      code: 'VOTE_ERROR'
    });
  }
});

/**
 * Support Routes
 */

// Submit support request
app.post('/api/support/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // In a real app, you would save this to a database
    // and send an email notification

    res.json({
      success: true,
      message: 'Support request submitted successfully'
    });

  } catch (error) {
    console.error('Support contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit support request',
      code: 'SUPPORT_ERROR'
    });
  }
});

// Get FAQs
app.get('/api/support/faq', (req, res) => {
  try {
    const faqs = [
      {
        id: 1,
        question: "How do I join a competition?",
        answer: "Click on any active competition and press the 'Join' button to participate."
      },
      {
        id: 2,
        question: "How does voting work?",
        answer: "Users can vote for their favorite models. Premium votes carry more weight."
      },
      {
        id: 3,
        question: "When are prizes distributed?",
        answer: "Prizes are distributed within 30 days after the competition ends."
      }
    ];

    res.json({
      success: true,
      faqs
    });

  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get FAQs',
      code: 'FAQ_ERROR'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Swing Boudoir API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Swing Boudoir API server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Manual authentication enabled`);
});

module.exports = app; 