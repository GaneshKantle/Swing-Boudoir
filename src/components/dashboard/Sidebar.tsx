import { 
  Bell, 
  User, 
  Users, 
  Trophy, 
  Vote, 
  Gift, 
  Settings as SettingsIcon, 
  HelpCircle, 
  FileText, 
  Shield, 
  Lock,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSection } from "@/pages/Dashboard";

interface SidebarProps {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

const sidebarItems = [
  { id: "notifications" as DashboardSection, label: "Notifications", icon: Bell },
  { id: "edit-profile" as DashboardSection, label: "Edit Profile", icon: User },
  { id: "public-profile" as DashboardSection, label: "Public Profile", icon: Users },
  { id: "competitions" as DashboardSection, label: "Competitions", icon: Trophy },
  { id: "votes" as DashboardSection, label: "Votes", icon: Vote },
  { id: "prize-history" as DashboardSection, label: "Prize History", icon: Gift },
  { id: "settings" as DashboardSection, label: "Settings", icon: SettingsIcon },
  { id: "support" as DashboardSection, label: "Support", icon: HelpCircle },
  { id: "official-rules" as DashboardSection, label: "Official Rules", icon: FileText },
  { id: "terms" as DashboardSection, label: "Terms of Service", icon: Shield },
  { id: "privacy" as DashboardSection, label: "Privacy Policy", icon: Lock },
];

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const handleLogout = () => {
    // TODO: Implement logout with your backend
    console.log("Logout clicked");
    // For now, redirect to home
    window.location.href = "/";
  };

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
      </div>
      
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
        
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </nav>
    </div>
  );
}