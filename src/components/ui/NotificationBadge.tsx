import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getUnreadNotificationCount } from '@/lib/notificationTriggers';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationBadgeProps {
  className?: string;
  showCount?: boolean;
  onClick?: () => void;
}

export function NotificationBadge({ 
  className = '', 
  showCount = true, 
  onClick 
}: NotificationBadgeProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!user?.profile?.id) return;
    
    try {
      setIsLoading(true);
      const count = await getUnreadNotificationCount(user.profile.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch count on mount and when user changes
  useEffect(() => {
    if (user?.profile?.id) {
      fetchUnreadCount();
    }
  }, [user?.profile?.id]);

  // Refresh count every 30 seconds
  useEffect(() => {
    if (user?.profile?.id) {
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.profile?.id]);

  // Don't render if no user
  if (!user?.profile?.id) {
    return null;
  }

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
    >
      <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
      
      {showCount && unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold min-w-0"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
      
      {isLoading && (
        <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-300 animate-pulse" />
      )}
    </div>
  );
}

export default NotificationBadge;
