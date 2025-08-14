import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, ProtectedRoute, useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PageLoader } from "@/components/PageLoader";
import { isProtectedRoute } from "@/routes";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import { CompetitionsPage } from "./pages/Competitions";
import Winners from "./pages/Winners";
import Rules from "./pages/Rules";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PublicProfilePage from "./pages/PublicProfilePage";
import CompetitionDetails from "./pages/CompetitionDetails";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import AddContest from "./pages/AddContest";
import Leaderboard from "./pages/Leaderboard";

// Voter Pages
import { 
  VoterDashboard, 
  BrowseContests, 
  BuyVotes, 
  VoteHistory, 
  Favorites,
  PaymentSuccess,
  PaymentFailure
} from "./pages/voters";

// Admin Pages
import { AdminLogin } from "./admin/pages/AdminLogin";
import { AdminRegister } from "./admin/pages/AdminRegister";

// Global Loading Wrapper Component
// Uses centralized route configuration from routes.ts for better maintainability
const AppContent: React.FC = () => {
  const { isLoading } = useAuth();
  const location = useLocation();

  // Show global loader only for protected routes while auth state is being determined
  // Public routes (like /auth/:id) should render immediately for better UX
  if (isLoading && isProtectedRoute(location.pathname)) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth/:id" element={<Auth />} />
      <Route path="/competitions" element={<CompetitionsPage />} />
      <Route path="/winners" element={<Winners />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/add-contest" element={<AddContest />} />
      <Route path="/profile/:id" element={<PublicProfilePage />} />
      <Route path="/competition/:id" element={<CompetitionDetails />} />

      {/* Onboarding Route */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard/:section?"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Voter Routes */}
      <Route
        path="/voters"
        element={
          <ProtectedRoute>
            <VoterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voters/browse-contests"
        element={
          <ProtectedRoute>
            <BrowseContests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voters/buy-votes"
        element={
          <ProtectedRoute>
            <BuyVotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voters/vote-history"
        element={
          <ProtectedRoute>
            <VoteHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voters/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voters/payment-success"
        element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voters/payment-failure"
        element={
          <ProtectedRoute>
            <PaymentFailure />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard/add-contest" element={<AddContest />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <OnboardingProvider>
          <NotificationProvider>
            <div className="App">
              <AppContent />
              <Toaster />
            </div>
          </NotificationProvider>
        </OnboardingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
