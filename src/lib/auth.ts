/**
 * Authentication Utilities for Swing Boudoir Showcase
 * 
 * This module handles:
 * - Google OAuth configuration and initialization
 * - Manual email/password authentication
 * - JWT token management and validation
 * - API authentication headers
 * - User session management
 */

import { jwtDecode } from 'jwt-decode';

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.swing-boudoir.com';

// Debug logging for environment variables
if (import.meta.env.DEV) {
  console.log('Google Client ID configured:', !!GOOGLE_CLIENT_ID);
  console.log('Google Client ID value:', GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'NOT SET');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Current origin:', window.location.origin);
}

// JWT Token Interface
export interface JWTPayload {
  sub: string;           // User ID
  email: string;         // User email
  name: string;          // User full name
  picture?: string;      // Profile picture URL
  iat: number;          // Issued at timestamp
  exp: number;          // Expiration timestamp
}

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication Response Interface
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Registration Data Interface
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

// Login Data Interface
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Initialize Google OAuth
 * Loads the Google API script and initializes the OAuth client
 */
export const initializeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Google Client ID is configured
    if (!GOOGLE_CLIENT_ID) {
      reject(new Error('Google Client ID is not configured'));
      return;
    }

    // Check if Google API is already loaded
    if (window.gapi) {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile'
        }).then(() => {
          console.log('Google OAuth initialized successfully');
          resolve();
        }).catch((error) => {
          console.error('Google OAuth initialization failed:', error);
          reject(error);
        });
      });
    } else {
      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile'
          }).then(() => {
            console.log('Google OAuth initialized successfully');
            resolve();
          }).catch((error) => {
            console.error('Google OAuth initialization failed:', error);
            reject(error);
          });
        });
      };
      script.onerror = (error) => {
        console.error('Failed to load Google API script:', error);
        reject(new Error('Failed to load Google API script'));
      };
      document.head.appendChild(script);
    }
  });
};

/**
 * Authenticate user with Google OAuth
 * @returns Promise<AuthResponse> - Authentication result with user data and token
 */
export const authenticateWithGoogle = async (): Promise<AuthResponse> => {
  try {
    // Ensure Google OAuth is initialized
    if (!window.gapi?.auth2) {
      await initializeGoogleAuth();
    }

    // Check if Google Client ID is configured
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google Client ID is not configured. Please check your environment variables.');
    }

    // Try popup authentication first, with fallback to redirect
    let googleUser;
    try {
      // First attempt: Try popup authentication
      googleUser = await window.gapi.auth2.getAuthInstance().signIn();
    } catch (signInError: unknown) {
      const error = signInError as { error?: string };
      
      // If popup fails, try redirect flow
      if (error.error === 'popup_closed_by_user' || error.error === 'popup_blocked') {
        console.log('Popup failed, trying redirect flow...');
        
        // Use redirect flow as fallback
        const authInstance = window.gapi.auth2.getAuthInstance();
        
        // Check if user is already signed in
        try {
          googleUser = await authInstance.signIn();
        } catch (retryError) {
          // If still failing, suggest manual retry
          throw new Error('Authentication was cancelled. Please try again and complete the Google sign-in process.');
        }
      } else if (error.error === 'access_denied') {
        throw new Error('Access was denied. Please allow access to your Google account.');
      } else if (error.error === 'immediate_failed') {
        throw new Error('Authentication failed. Please try again.');
      } else {
        throw new Error(`Google authentication failed: ${error.error || 'Unknown error'}`);
      }
    }

    const profile = googleUser.getBasicProfile();
    const idToken = googleUser.getAuthResponse().id_token;

    // Validate that we have the required data
    if (!profile.getId() || !profile.getEmail()) {
      throw new Error('Incomplete profile data received from Google.');
    }

    // Prepare user data for backend
    const userData = {
      googleId: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl(),
      idToken: idToken
    };

    // Send to backend for verification and JWT generation
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Backend authentication failed: ${response.status} ${response.statusText}`);
    }

    const result: AuthResponse = await response.json();

    if (result.success && result.token) {
      // Store token in memory (not localStorage for security)
      sessionStorage.setItem('authToken', result.token);
      sessionStorage.setItem('userData', JSON.stringify(result.user));
      
      // Set up automatic token refresh
      setupTokenRefresh(result.token);
      
      return result;
    } else {
      throw new Error(result.error || 'Authentication failed');
    }
  } catch (error) {
    console.error('Google authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
};

/**
 * Register new user with email and password
 * @param data - Registration data
 * @returns Promise<AuthResponse> - Registration result
 */
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // Validate password confirmation
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      };
    }

    // Validate password strength
    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      };
    }

    // Send registration request to backend
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Registration failed: ${response.status} ${response.statusText}`
      };
    }

    const result: AuthResponse = await response.json();

    if (result.success && result.token) {
      // Store token in memory (not localStorage for security)
      sessionStorage.setItem('authToken', result.token);
      sessionStorage.setItem('userData', JSON.stringify(result.user));
      
      // Set up automatic token refresh
      setupTokenRefresh(result.token);
      
      return result;
    } else {
      return {
        success: false,
        error: result.error || 'Registration failed'
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    };
  }
};

/**
 * Login user with email and password
 * @param data - Login data
 * @returns Promise<AuthResponse> - Login result
 */
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    // Send login request to backend
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Login failed: ${response.status} ${response.statusText}`
      };
    }

    const result: AuthResponse = await response.json();

    if (result.success && result.token) {
      // Store token in memory (not localStorage for security)
      sessionStorage.setItem('authToken', result.token);
      sessionStorage.setItem('userData', JSON.stringify(result.user));
      
      // Set up automatic token refresh
      setupTokenRefresh(result.token);
      
      return result;
    } else {
      return {
        success: false,
        error: result.error || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    };
  }
};

/**
 * Validate and decode JWT token
 * @param token - JWT token to validate
 * @returns JWTPayload | null - Decoded token payload or null if invalid
 */
export const validateToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Get current authentication token
 * @returns string | null - Current token or null if not authenticated
 */
export const getAuthToken = (): string | null => {
  const token = sessionStorage.getItem('authToken');
  if (!token) return null;
  
  // Validate token before returning
  const isValid = validateToken(token);
  if (!isValid) {
    // Clear invalid token
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    return null;
  }
  
  return token;
};

/**
 * Get current user data
 * @returns User | null - Current user data or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  const userData = sessionStorage.getItem('userData');
  const token = getAuthToken();
  
  if (!userData || !token) {
    return null;
  }
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Logout user and clear session
 */
export const logout = (): void => {
  // Sign out from Google
  if (window.gapi?.auth2) {
    window.gapi.auth2.getAuthInstance().signOut();
  }
  
  // Clear session storage
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userData');
  
  // Clear any refresh token timers
  if (window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
  }
};

/**
 * Setup automatic token refresh
 * @param token - Current JWT token
 */
const setupTokenRefresh = (token: string): void => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
    
    // Refresh token 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 60000); // Minimum 1 minute
    
    window.tokenRefreshTimer = setTimeout(async () => {
      await refreshToken();
    }, refreshTime);
  } catch (error) {
    console.error('Error setting up token refresh:', error);
  }
};

/**
 * Refresh authentication token
 */
const refreshToken = async (): Promise<void> => {
  try {
    const currentToken = getAuthToken();
    if (!currentToken) return;
    
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result: AuthResponse = await response.json();
    
    if (result.success && result.token) {
      sessionStorage.setItem('authToken', result.token);
      setupTokenRefresh(result.token);
    } else {
      // Token refresh failed, logout user
      logout();
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    logout();
  }
};

/**
 * Create authenticated API headers
 * @returns Headers object with authentication token
 */
export const createAuthHeaders = (): Headers => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  
  const token = getAuthToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  return headers;
};

/**
 * Check if user is authenticated
 * @returns boolean - True if user is authenticated and token is valid
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Google API types
interface GoogleAuth {
  init(config: { client_id: string; scope: string }): Promise<void>;
  getAuthInstance(): {
    signIn(): Promise<{
      getBasicProfile(): {
        getId(): string;
        getEmail(): string;
        getName(): string;
        getImageUrl(): string;
      };
      getAuthResponse(): { id_token: string };
    }>;
    signOut(): void;
  };
}

interface GoogleAPI {
  load(api: string, callback: () => void): void;
  auth2: GoogleAuth;
}

// Extend Window interface for Google API
declare global {
  interface Window {
    gapi: GoogleAPI;
    tokenRefreshTimer?: NodeJS.Timeout;
  }
}