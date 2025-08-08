import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";
import { EditProfile } from "@/components/dashboard/EditProfile";
import { PublicProfile } from "@/components/dashboard/PublicProfile";
import { DashboardCompetitions } from "@/components/dashboard/DashboardCompetitions";
import { Votes } from "@/components/dashboard/Votes";
import { PrizeHistory } from "@/components/dashboard/PrizeHistory";
import { Settings } from "@/components/dashboard/Settings";
import { Support } from "@/components/dashboard/Support";
import { OfficialRules } from "@/components/dashboard/OfficialRules";
import { PrivacyPolicy } from "@/components/dashboard/PrivacyPolicy";
import Header from "@/components/Header";

export type DashboardSection = 
  | "notifications" 
  | "edit-profile" 
  | "public-profile" 
  | "competitions" 
  | "votes" 
  | "prize-history" 
  | "settings" 
  | "support" 
  | "official-rules"
  | "privacy";

function DashboardLayout({
  activeSection,
  setActiveSection,
  children,
}: {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={handleSidebarToggle} />
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </aside>
        
        {/* Mobile Sidebar */}
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isMobile={true}
          isOpen={isMobileSidebarOpen}
          onToggle={() => setIsMobileSidebarOpen(false)}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("notifications");

  const renderContent = () => {
    console.log('Rendering dashboard section:', activeSection);
    
    switch (activeSection) {
      case "notifications":
        console.log('Rendering DashboardNotifications');
        return <DashboardNotifications />;
      case "edit-profile":
        console.log('Rendering EditProfile');
        return <EditProfile />;
      case "public-profile":
        console.log('Rendering PublicProfile');
        return <PublicProfile />;
      case "competitions":
        console.log('Rendering DashboardCompetitions');
        return <DashboardCompetitions />;
      case "votes":
        console.log('Rendering Votes');
        return <Votes />;
      case "prize-history":
        console.log('Rendering PrizeHistory');
        return <PrizeHistory />;
      case "settings":
        console.log('Rendering Settings');
        return <Settings />;
      case "support":
        console.log('Rendering Support');
        return <Support />;
      case "official-rules":
        console.log('Rendering OfficialRules');
        return <OfficialRules />;
      case "privacy":
        console.log('Rendering PrivacyPolicy');
        return <PrivacyPolicy />;
      default:
        console.log('Rendering default DashboardNotifications');
        return <DashboardNotifications />;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
}