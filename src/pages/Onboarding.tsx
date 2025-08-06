import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { ProfileSetupStep } from '@/components/onboarding/ProfileSetupStep';
import { PreferencesStep } from '@/components/onboarding/PreferencesStep';
import { TutorialStep } from '@/components/onboarding/TutorialStep';
import { RulesStep } from '@/components/onboarding/RulesStep';
import { FirstCompetitionStep } from '@/components/onboarding/FirstCompetitionStep';
import { DashboardTourStep } from '@/components/onboarding/DashboardTourStep';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    currentStep, 
    totalSteps, 
    isOnboardingComplete, 
    isLoading,
    steps 
  } = useOnboarding();

  // Redirect if not authenticated
  useEffect(() => {
    console.log('Onboarding page - isAuthenticated:', isAuthenticated);
    console.log('Onboarding page - isOnboardingComplete:', isOnboardingComplete);
    console.log('Onboarding page - isLoading:', isLoading);
    
    if (!isAuthenticated) {
      console.log('Onboarding page - Not authenticated, redirecting to auth');
      navigate('/auth');
      return;
    }

    // Redirect to dashboard if onboarding is complete
    if (isOnboardingComplete) {
      console.log('Onboarding page - Onboarding complete, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, isOnboardingComplete, navigate, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate step component
  const renderStep = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData?.id) {
      case 'welcome':
        return <WelcomeStep />;
      case 'profile-setup':
        return <ProfileSetupStep />;
      case 'preferences':
        return <PreferencesStep />;
      case 'tutorial':
        return <TutorialStep />;
      case 'rules':
        return <RulesStep />;
      case 'first-competition':
        return <FirstCompetitionStep />;
      case 'dashboard-tour':
        return <DashboardTourStep />;
      default:
        return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <OnboardingLayout>
        {renderStep()}
      </OnboardingLayout>
    </div>
  );
};

export default Onboarding; 