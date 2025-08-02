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
import { TermsOfService } from "@/components/dashboard/TermsOfService";
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
  | "terms" 
  | "privacy";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("notifications");

  const renderContent = () => {
    switch (activeSection) {
      case "notifications":
        return <DashboardNotifications />;
      case "edit-profile":
        return <EditProfile />;
      case "public-profile":
        return <PublicProfile />;
      case "competitions":
        return <DashboardCompetitions />;
      case "votes":
        return <Votes />;
      case "prize-history":
        return <PrizeHistory />;
      case "settings":
        return <Settings />;
      case "support":
        return <Support />;
      case "official-rules":
        return <OfficialRules />;
      case "terms":
        return <TermsOfService />;
      case "privacy":
        return <PrivacyPolicy />;
      default:
        return <DashboardNotifications />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}