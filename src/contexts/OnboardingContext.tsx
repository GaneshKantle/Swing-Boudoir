import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface OnboardingData {
  // Phase 1: Welcome & Account Setup
  profilePhoto?: string;
  basicInfo: {
    name: string;
    bio: string;
    age: string;
    location: string;
    hobbies?: string;
    paidVoterMessage?: string;
    freeVoterMessage?: string;
    socialMedia: {
      instagram?: string;
      tiktok?: string;
      twitter?: string;
    };
  };
  portfolioPhotos: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';

  // Phase 2: Platform Education
  preferences: {
    competitionTypes: string[];
    goals: string[];
    availability: 'full-time' | 'part-time' | 'weekends' | 'flexible';
    travelPreferences: 'local' | 'national' | 'international' | 'any';
  };

  // Phase 3: First Steps
  firstCompetition?: string;
  tutorialCompleted: boolean;
  rulesAccepted: boolean;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  phase: 1 | 2 | 3;
  completed: boolean;
  required: boolean;
}

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  onboardingData: OnboardingData;
  steps: OnboardingStep[];
  isOnboardingComplete: boolean;
  isLoading: boolean;
  
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeStep: (stepId: string) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  checkUserProfile: () => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STEPS: OnboardingStep[] = [
  // Phase 1: Welcome & Account Setup
  {
    id: 'welcome',
    title: 'Welcome to Swing Boudoir!',
    description: 'Let\'s get you set up for success',
    phase: 1,
    completed: false,
    required: true
  },
  {
    id: 'profile-setup',
    title: 'Complete Your Profile',
    description: 'Tell us about yourself and upload your photos',
    phase: 1,
    completed: false,
    required: true
  },
  {
    id: 'preferences',
    title: 'Your Preferences & Goals',
    description: 'Help us match you with the right opportunities',
    phase: 1,
    completed: false,
    required: true
  },

  // Phase 2: Platform Education
  {
    id: 'tutorial',
    title: 'How It Works',
    description: 'Learn how competitions and voting work',
    phase: 2,
    completed: false,
    required: true
  },
  {
    id: 'rules',
    title: 'Rules & Guidelines',
    description: 'Important information to keep you safe and successful',
    phase: 2,
    completed: false,
    required: true
  },

  // Phase 3: First Steps
  {
    id: 'first-competition',
    title: 'Your First Competition',
    description: 'Browse and register for your first competition',
    phase: 3,
    completed: false,
    required: true
  },
  {
    id: 'dashboard-tour',
    title: 'Dashboard Tour',
    description: 'Learn how to navigate your dashboard',
    phase: 3,
    completed: false,
    required: true
  }
];

const initialOnboardingData: OnboardingData = {
  basicInfo: {
    name: '',
    bio: '',
    age: '',
    location: '',
    socialMedia: {}
  },
  portfolioPhotos: [],
  experienceLevel: 'beginner',
  preferences: {
    competitionTypes: [],
    goals: [],
    availability: 'flexible',
    travelPreferences: 'local'
  },
  tutorialCompleted: false,
  rulesAccepted: false
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
  const [steps, setSteps] = useState<OnboardingStep[]>(ONBOARDING_STEPS);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const totalSteps = steps.length;

  // Check if user has existing profile
  const checkUserProfile = async (): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;

    try {
      const response = await fetch(`https://api.swingboudoirmag.com/api/v1/users/${user.id}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profile = await response.json();
        return !!profile; // Return true if profile exists
      }
      return false;
    } catch (error) {
      console.error('Error checking user profile:', error);
      return false;
    }
  };

  // Initialize onboarding state
  useEffect(() => {
    const initializeOnboarding = async () => {
      console.log('OnboardingContext - Initializing onboarding...');
      console.log('OnboardingContext - User:', user);
      console.log('OnboardingContext - isAuthenticated:', isAuthenticated);
      
      if (!user || !isAuthenticated) {
        console.log('OnboardingContext - No user or not authenticated, setting loading to false');
        setIsLoading(false);
        return;
      }

      try {
        const hasProfile = await checkUserProfile();
        console.log('OnboardingContext - User has profile:', hasProfile);
        
        if (hasProfile) {
          console.log('OnboardingContext - Setting onboarding as complete');
          setIsOnboardingComplete(true);
        } else {
          console.log('OnboardingContext - User needs onboarding, loading saved data');
          // Load saved onboarding data from localStorage
          const savedData = localStorage.getItem(`onboarding_${user.id}`);
          if (savedData) {
            setOnboardingData(JSON.parse(savedData));
          }
        }
      } catch (error) {
        console.error('Error initializing onboarding:', error);
      } finally {
        console.log('OnboardingContext - Setting loading to false');
        setIsLoading(false);
      }
    };

    initializeOnboarding();
  }, [user, isAuthenticated]);

  // Save onboarding data to localStorage
  useEffect(() => {
    if (user && onboardingData !== initialOnboardingData) {
      localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(onboardingData));
    }
  }, [onboardingData, user]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const skipOnboarding = () => {
    setIsOnboardingComplete(true);
    localStorage.setItem(`onboarding_${user?.id}_skipped`, 'true');
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      // Create user profile using API
      const profileData = {
        userId: user.id,
        bio: onboardingData.basicInfo.bio,
        avatarUrl: onboardingData.profilePhoto,
        phone: null, // Optional field
        address: onboardingData.basicInfo.location,
        city: onboardingData.basicInfo.location.split(',')[0]?.trim() || '',
        country: onboardingData.basicInfo.location.split(',')[1]?.trim() || 'United States',
        postalCode: null, // Optional field
        dateOfBirth: onboardingData.basicInfo.age,
        gender: 'Not specified',
        hobbiesAndPassions: onboardingData.basicInfo.hobbies || '',
        paidVoterMessage: onboardingData.basicInfo.paidVoterMessage || 'Thank you for your support!',
        freeVoterMessage: onboardingData.basicInfo.freeVoterMessage || 'Thank you for voting!',
        lastFreeVoteAt: null,
        coverImageId: null
      };

      const response = await fetch('https://api.swingboudoirmag.com/api/v1/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        // Upload portfolio photos if any
        if (onboardingData.portfolioPhotos && onboardingData.portfolioPhotos.length > 0) {
          try {
            // Create portfolio entries for each photo
            const portfolioPromises = onboardingData.portfolioPhotos.map(async (photoUrl) => {
              const portfolioResponse = await fetch('https://api.swingboudoirmag.com/api/v1/profile/portfolio', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId: user.id,
                  photoUrl: photoUrl,
                  description: 'Portfolio photo'
                })
              });
              
              if (!portfolioResponse.ok) {
                console.warn('Failed to upload portfolio photo:', photoUrl);
              }
            });
            
            await Promise.all(portfolioPromises);
          } catch (error) {
            console.warn('Error uploading portfolio photos:', error);
          }
        }

        setIsOnboardingComplete(true);
        localStorage.setItem(`onboarding_${user.id}_complete`, 'true');
        localStorage.removeItem(`onboarding_${user.id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const value: OnboardingContextType = {
    currentStep,
    totalSteps,
    onboardingData,
    steps,
    isOnboardingComplete,
    isLoading,
    nextStep,
    prevStep,
    goToStep,
    updateOnboardingData,
    completeStep,
    skipOnboarding,
    completeOnboarding,
    checkUserProfile
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 