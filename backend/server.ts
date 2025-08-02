/**
 * Swing Boudoir Showcase Backend Server
 * 
 * This server provides:
 * - Google OAuth authentication
 * - JWT token management
 * - User profile management
 * - Competition and voting APIs
 * - File upload handling
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { OAuth2Client } from 'google-auth-library';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables with proper typing
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Initialize Google OAuth client
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
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

// Type definitions
interface User {
  id: string;
  googleId?: string;
  email: string;
  name: string;
  picture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  settings?: Record<string, any>;
}

interface JWTPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  iat: number;
  exp: number;
}

interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// In-memory data storage (replace with database in production)
let users: User[] = [];
let competitions: any[] = [];
let votes: any[] = [];
let notifications: any[] = [];
let prizes: any[] = [];

// JWT Token generation
const generateToken = (user: User): string => {
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
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ 
      success: false, 
      error: 'Access token required',
      code: 'TOKEN_REQUIRED'
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
      return;
    }
    req.user = user as JWTPayload;
    next();
  });
};

// Google OAuth verification
const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

/**
 * Authentication Routes
 */

// Google OAuth login/register
app.post('/api/auth/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, googleId, email, name, picture } = req.body;

    // Verify Google token
    const googlePayload = await verifyGoogleToken(idToken);
    
    if (googlePayload?.email !== email) {
      res.status(400).json({
        success: false,
        error: 'Email mismatch',
        code: 'EMAIL_MISMATCH'
      });
      return;
    }

    // Check if user exists
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user
      user = {
        id: Date.now().toString(),
        googleId,
        email,
        name,
        picture,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(user);
    } else {
      // Update existing user
      user.googleId = googleId;
      user.name = name;
      user.picture = picture;
      user.updatedAt = new Date().toISOString();
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      user,
      token
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
});

// Token refresh
app.post('/api/auth/refresh', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = users.find(u => u.id === req.user?.sub);
    
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
app.post('/api/auth/logout', authenticateToken, (_req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * User Profile Routes
 */

// Get user profile
app.get('/api/user/profile', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = users.find(u => u.id === req.user?.sub);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
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
app.put('/api/user/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = users.find(u => u.id === req.user?.sub);
    
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
app.post('/api/user/profile/images', authenticateToken, upload.array('images', 10), (req: Request, res: Response) => {
  try {
    const uploadedFiles = (req.files as Express.Multer.File[]).map(file => ({
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
app.delete('/api/user/profile/images/:imageId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
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
app.get('/api/competitions/user', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userCompetitions = competitions.filter(c => 
      c.participants.includes(req.user?.sub)
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
app.get('/api/competitions/available', (req: Request, res: Response) => {
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
app.post('/api/competitions/:id/join', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
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

    if (competition.participants.includes(req.user?.sub)) {
      return res.status(400).json({
        success: false,
        error: 'Already joined this competition',
        code: 'ALREADY_JOINED'
      });
    }

    competition.participants.push(req.user?.sub);

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
app.get('/api/competitions/:id', (req: Request, res: Response) => {
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
app.get('/api/votes/stats', (req: Request, res: Response) => {
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
app.get('/api/votes/top-voters', (req: Request, res: Response) => {
  try {
    const voterCounts: Record<string, number> = {};
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
app.get('/api/votes/recent', (req: Request, res: Response) => {
  try {
    const recentVotes = votes
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
app.get('/api/votes/premium', (req: Request, res: Response) => {
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
app.get('/api/notifications', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userNotifications = notifications.filter(n => 
      n.userId === req.user?.sub
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
app.post('/api/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => 
      n.id === id && n.userId === req.user?.sub
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
app.post('/api/notifications/read-all', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    notifications.forEach(n => {
      if (n.userId === req.user?.sub) {
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
app.get('/api/prizes/history', (req: Request, res: Response) => {
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
app.get('/api/prizes/upcoming', (req: Request, res: Response) => {
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
app.get('/api/prizes/stats', (req: Request, res: Response) => {
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
app.get('/api/settings', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = users.find(u => u.id === req.user?.sub);
    
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
app.put('/api/settings', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = users.find(u => u.id === req.user?.sub);
    
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
app.put('/api/settings/password', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
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
app.delete('/api/user/account', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user?.sub);
    
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
app.get('/api/public/profile/:modelId', (req: Request, res: Response) => {
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
app.post('/api/public/profile/:modelId/vote', (req: Request, res: Response) => {
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
app.post('/api/support/contact', (req: Request, res: Response) => {
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
app.get('/api/support/faq', (req: Request, res: Response) => {
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
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Swing Boudoir API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
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
  console.log(`🔐 Google OAuth Configuration:`);
  console.log(`   - Client ID: ${GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   - Client Secret: ${GOOGLE_CLIENT_SECRET ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🔑 JWT Secret: ${JWT_SECRET ? '✅ Configured' : '❌ Not configured'}`);
});

export default app; 