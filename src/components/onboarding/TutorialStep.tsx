import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Trophy, Camera, Heart, DollarSign } from 'lucide-react';

export const TutorialStep: React.FC = () => {
  const { nextStep, completeStep } = useOnboarding();

  const steps = [
    {
      icon: <Camera className="h-8 w-8 text-purple-500" />,
      title: "Upload Photos",
      description: "Share your best photos to showcase your talent"
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Get Votes",
      description: "Fans vote for you daily to help you win"
    },
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Win Prizes",
      description: "Earn money and prizes from competitions"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      title: "Make Money",
      description: "Build your following and earn income"
    }
  ];

  const handleContinue = () => {
    completeStep('tutorial');
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          How It Works
        </h2>
        <p className="text-gray-600 text-lg">
          It's simple! Here's how you can succeed on our platform
        </p>
      </div>

      {/* Simple Steps */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Story */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-lg mx-auto">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <p className="text-gray-700 font-medium">"I won $5,000 in my first month!"</p>
            <p className="text-sm text-gray-600">- Sarah M.</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">💡 Quick Tips</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Upload high-quality photos to stand out</p>
          <p>• Share your profile on social media</p>
          <p>• Thank people who vote for you</p>
          <p>• Update your photos regularly</p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center pt-6">
        <Button
          onClick={handleContinue}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl"
        >
          Continue to Rules
        </Button>
      </div>
    </div>
  );
}; 