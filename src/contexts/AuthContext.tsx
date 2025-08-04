/**
 * Authentication Context for Swing Boudoir Showcase
 * 
 * This context provides:
 * - Global authentication state management
 * - Manual email/password authentication
 * - User session management
 * - Protected route handling
 * 
 * @author Swing Boudoir Development Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, 
  isAuthenticated, 
  logout as logoutUser,
  loginWithEmail,
  registerUser,
  User,
  AuthResponse
} from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Authentication Context Interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages global authentication state and provides auth methods to child components
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Initialize authentication state on component mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        const currentUser = getCurrentUser();
        const authenticated = isAuthenticated();
        
        if (authenticated && currentUser) {
          setUser(currentUser);
          setIsAuth(true);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [toast]);

  /**
   * Handle email/password login
   */
  const handleLoginWithEmail = async (credentials: { email: string; password: string }): Promise<void> => {
    try {
      setIsLoading(true);
      
      const authResponse: AuthResponse = await loginWithEmail(credentials);
      
      if (authResponse.success && authResponse.user && authResponse.token) {
        setUser(authResponse.user);
        setIsAuth(true);
        
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${authResponse.user.name}!`,
        });
        
        // Navigate to dashboard after successful login
        navigate('/dashboard');
      } else {
        throw new Error(authResponse.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration
   */
  const handleRegister = async (userData: { name: string; email: string; password: string }): Promise<void> => {
    try {
      setIsLoading(true);
      
      const authResponse: AuthResponse = await registerUser(userData);
      
      if (authResponse.success && authResponse.user && authResponse.token) {
        setUser(authResponse.user);
        setIsAuth(true);
        
        toast({
          title: "Registration Successful!",
          description: `Welcome, ${authResponse.user.name}!`,
        });
        
        // Navigate to dashboard after successful registration
        navigate('/dashboard');
      } else {
        throw new Error(authResponse.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const logout = (): void => {
    try {
      // Clear authentication state
      logoutUser();
      setUser(null);
      setIsAuth(false);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: "Logout Error",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Refresh user data from session storage
   */
  const refreshUser = (): void => {
    const currentUser = getCurrentUser();
    const authenticated = isAuthenticated();
    
    if (authenticated && currentUser) {
      setUser(currentUser);
      setIsAuth(true);
    } else {
      setUser(null);
      setIsAuth(false);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: isAuth,
    loginWithEmail: handleLoginWithEmail,
    register: handleRegister,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 * @returns AuthContextType - Authentication context value
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * Protected Route Component
 * Wraps components that require authentication
 */
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 