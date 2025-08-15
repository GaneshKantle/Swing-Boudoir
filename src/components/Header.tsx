import { Button } from "@/components/ui/button";
import { Menu, Trophy, User, Bell, LogOut, Settings, SettingsIcon, Users, Vote, Gift, HelpCircle, FileText, Lock, TrendingUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, handleLogout } = useAuth();
  const { unreadCount } = useNotifications();
  const isDashboardPage = location.pathname.startsWith("/dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationsClick = () => {
    navigate("/dashboard/notifications");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Mobile menu items for dashboard pages
  const mobileMenuItems = [
    { id: "notifications", label: "Notifications", icon: Bell, onClick: handleNotificationsClick },
    { id: "competitions", label: "Competitions", icon: Trophy, onClick: () => navigate("/dashboard/competitions") },
    { id: "public-profile", label: "Public Profile", icon: Users, onClick: () => navigate("/dashboard/public-profile") },
    { id: "votes", label: "Votes", icon: Vote, onClick: () => navigate("/dashboard/votes") },
    { id: "prize-history", label: "Prize History", icon: Gift, onClick: () => navigate("/dashboard/prize-history") },
    { id: "leaderboard", label: "Leaderboard", icon: TrendingUp, onClick: () => navigate("/dashboard/leaderboard") },
    { id: "support", label: "Support", icon: HelpCircle, onClick: () => navigate("/dashboard/support") },
    { id: "official-rules", label: "Official Rules", icon: FileText, onClick: () => navigate("/dashboard/official-rules") },
    { id: "privacy", label: "Privacy Policy", icon: Lock, onClick: () => navigate("/dashboard/privacy") },
    { id: "settings", label: "Settings", icon: SettingsIcon, onClick: () => navigate("/dashboard/settings") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                 {/* Mobile Menu Button - Far Left (Mobile Only) */}
         {isAuthenticated && (
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="lg:hidden"
           >
             <Menu className="w-5 h-5" />
           </Button>
         )}

                 {/* Logo - Center (Mobile) / Left (Desktop) */}
         <div className={`flex items-center ${isAuthenticated ? 'lg:flex' : 'flex'}`}>
           <Link to="/" className="flex flex-col items-start">
             <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
             <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
           </Link>
         </div>

        {/* Right side - Desktop navigation and profile menu */}
        <div className="flex items-center space-x-6">
                     {/* Navigation Links - Only show on non-dashboard pages (Desktop) */}
           {!isDashboardPage && (
             <nav className="hidden lg:flex items-center space-x-6">
               <Link to="/competitions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                 Competitions
               </Link>
               <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                 Leaderboard
               </Link>
             </nav>
           )}

                     {/* Mobile Sidebar Toggle - Only show on dashboard pages (Desktop) */}
           {isDashboardPage && (
             <Button variant="ghost" size="sm" onClick={onSidebarToggle} className="hidden lg:flex">
               <Menu className="w-5 h-5" />
             </Button>
           )}

          {/* Profile Menu - Show when authenticated */}
          {isAuthenticated && user && (
            <>
                             {/* Notifications Icon - Desktop Only */}
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={handleNotificationsClick}
                 className="relative h-8 w-8 rounded-full p-0 hidden lg:flex"
               >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                  <div className="p-4 border-b">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate("/dashboard/", { replace: true, flushSync: true })}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-9 px-2" onClick={() => navigate("/dashboard/settings", { replace: true, flushSync: true })}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                    <div className="border-t my-2" />
                    <Button variant="ghost" className="w-full justify-start h-9 px-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogoutClick}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}

          {/* Auth Buttons - Show when not authenticated */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link to="/auth/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

             {/* Mobile Menu Overlay */}
       {isMobileMenuOpen && isAuthenticated && (
         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
          <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border shadow-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {mobileMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start h-12"
                    onClick={() => {
                      item.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span className="text-base">{item.label}</span>
                    {item.id === "notifications" && unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                );
              })}
              
              <div className="pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    handleLogoutClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="text-base">Log out</span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
