declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server Configuration
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      
      // JWT Configuration
      JWT_SECRET: string;
      
      // Google OAuth Configuration
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      
      // Frontend Configuration
      FRONTEND_URL?: string;
      
      // Database Configuration (for future use)
      DATABASE_URL?: string;
      
      // API Configuration
      API_BASE_URL?: string;
    }
  }
}

export {}; 