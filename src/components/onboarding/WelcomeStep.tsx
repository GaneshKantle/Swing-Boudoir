import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Camera, Trophy } from 'lucide-react';

export const WelcomeStep: React.FC = () => {
  const { user } = useAuth();
  const { nextStep, completeStep } = useOnboarding();

  const handleGetStarted = () => {
    completeStep('welcome');
    nextStep();
  };

  return (
    <div className="text-center space-y-8">
      {/* Welcome Message */}
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name || 'Beautiful'}! ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            You're about to start an amazing journey where you can earn money, 
            build your following, and win incredible prizes!
          </p>
        </div>
      </div>

      {/* Simple Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Camera className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Upload Photos</h3>
          <p className="text-gray-600 text-sm">Share your best photos</p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Get Votes</h3>
          <p className="text-gray-600 text-sm">Fans vote for you daily</p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Win Prizes</h3>
          <p className="text-gray-600 text-sm">Earn money and prizes</p>
        </div>
      </div>

      {/* Success Story */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-lg mx-auto">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div className="text-left">
            <p className="text-gray-700 font-medium">"I won $5,000 in my first month!"</p>
            <p className="text-sm text-gray-600">- Sarah M.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="space-y-4">
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl"
        >
          Let's Get Started! 🚀
        </Button>
        <p className="text-sm text-gray-500">
          It only takes 2 minutes to set up your profile
        </p>
      </div>
    </div>
  );
}; 