import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Competitions from "./pages/Competitions";
import Winners from "./pages/Winners";
import Rules from "./pages/Rules";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PublicProfilePage from "./pages/PublicProfilePage";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";

// Admin Pages
import { AdminLogin } from "./admin/pages/AdminLogin";
import { AdminRegister } from "./admin/pages/AdminRegister";

function App() {
  return (
    <Router>
      <AuthProvider>
        <OnboardingProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/winners" element={<Winners />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile/:id" element={<PublicProfilePage />} />
              
              {/* Onboarding Route */}
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard/*" element={<Dashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </OnboardingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
