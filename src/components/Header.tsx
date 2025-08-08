import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  onSidebarToggle?: () => void;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  const location = useLocation();
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex flex-col items-start">
            <div className="text-2xl font-display font-bold text-primary tracking-tight">
              SWING
            </div>
            <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">
              Boudoir
            </div>
          </a>
        </div>

        {/* Mobile Sidebar Toggle - Only show on dashboard pages */}
        {isDashboardPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;