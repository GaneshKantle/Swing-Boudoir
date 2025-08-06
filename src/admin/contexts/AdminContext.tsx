import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AdminAnalytics, AdminSettings } from '../types/adminTypes';

interface AdminContextType {
  currentAdmin: AdminUser | null;
  analytics: AdminAnalytics | null;
  settings: AdminSettings | null;
  isLoading: boolean;
  error: string | null;
  refreshAnalytics: () => void;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  logAdminAction: (action: string, targetType: string, targetId: string, details?: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock admin data - replace with actual API calls
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        setIsLoading(true);
        
        // Mock admin user data
        const adminUser: AdminUser = {
          id: 'admin-1',
          email: 'admin@swingboudoir.com',
          name: 'Admin User',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          lastLogin: new Date().toISOString(),
          competitions: 0,
          totalVotes: 0
        };

        // Mock analytics data
        const mockAnalytics: AdminAnalytics = {
          totalUsers: 1250,
          activeUsers: 890,
          totalCompetitions: 15,
          activeCompetitions: 8,
          totalVotes: 45600,
          totalRevenue: 125000,
          dailyStats: [
            { date: '2024-01-01', newUsers: 45, newVotes: 1200, revenue: 5000 },
            { date: '2024-01-02', newUsers: 52, newVotes: 1350, revenue: 5500 },
            { date: '2024-01-03', newUsers: 38, newVotes: 980, revenue: 4200 },
            { date: '2024-01-04', newUsers: 61, newVotes: 1650, revenue: 6800 },
            { date: '2024-01-05', newUsers: 47, newVotes: 1280, revenue: 5200 },
            { date: '2024-01-06', newUsers: 55, newVotes: 1420, revenue: 5800 },
            { date: '2024-01-07', newUsers: 43, newVotes: 1150, revenue: 4800 }
          ]
        };

        // Mock settings data
        const mockSettings: AdminSettings = {
          siteName: 'Swing Boudoir',
          siteDescription: 'Premium boudoir photography competitions',
          maintenanceMode: false,
          registrationEnabled: true,
          emailNotifications: true,
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif'],
          rateLimits: {
            votesPerHour: 100,
            uploadsPerDay: 10
          }
        };

        setCurrentAdmin(adminUser);
        setAnalytics(mockAnalytics);
        setSettings(mockSettings);
        setError(null);
      } catch (err) {
        setError('Failed to initialize admin panel');
        console.error('Admin initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAdmin();
  }, []);

  const refreshAnalytics = async () => {
    try {
      // Mock API call to refresh analytics
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to refresh analytics:', err);
    }
  };

  const updateSettings = async (newSettings: Partial<AdminSettings>) => {
    try {
      // Mock API call to update settings
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const logAdminAction = async (action: string, targetType: string, targetId: string, details?: any) => {
    try {
      const adminAction = {
        adminId: currentAdmin?.id,
        action,
        targetType,
        targetId,
        details,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1' // In real app, get from request
      };

      // Mock API call to log admin action
      await fetch('/api/admin/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(adminAction)
      });
    } catch (err) {
      console.error('Failed to log admin action:', err);
    }
  };

  const value: AdminContextType = {
    currentAdmin,
    analytics,
    settings,
    isLoading,
    error,
    refreshAnalytics,
    updateSettings,
    logAdminAction
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 