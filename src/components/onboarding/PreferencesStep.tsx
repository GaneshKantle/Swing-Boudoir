import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Trophy, Heart, Star, Camera } from 'lucide-react';

export const PreferencesStep: React.FC = () => {
  const { onboardingData, updateOnboardingData, nextStep, completeStep } = useOnboarding();

  const goals = [
    { id: 'money', label: 'Earn Money', icon: <Trophy className="h-5 w-5" /> },
    { id: 'fame', label: 'Build Fame', icon: <Star className="h-5 w-5" /> },
    { id: 'career', label: 'Modeling Career', icon: <Camera className="h-5 w-5" /> },
    { id: 'confidence', label: 'Build Confidence', icon: <Heart className="h-5 w-5" /> }
  ];

  const handleGoalChange = (goalId: string, checked: boolean) => {
    const currentGoals = onboardingData.preferences.goals;
    if (checked) {
      updateOnboardingData({
        preferences: {
          ...onboardingData.preferences,
          goals: [...currentGoals, goalId]
        }
      });
    } else {
      updateOnboardingData({
        preferences: {
          ...onboardingData.preferences,
          goals: currentGoals.filter(id => id !== goalId)
        }
      });
    }
  };

  const handleContinue = () => {
    if (onboardingData.preferences.goals.length === 0) {
      // Show error or warning
      return;
    }
    completeStep('preferences');
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          What do you want to achieve?
        </h2>
        <p className="text-gray-600 text-lg">
          Select your goals to help us match you with the right opportunities
        </p>
      </div>

      {/* Goals Selection */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {goals.map((goal) => (
            <div 
              key={goal.id} 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                onboardingData.preferences.goals.includes(goal.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => handleGoalChange(goal.id, !onboardingData.preferences.goals.includes(goal.id))}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={goal.id}
                  checked={onboardingData.preferences.goals.includes(goal.id)}
                  onCheckedChange={(checked) => handleGoalChange(goal.id, checked as boolean)}
                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <div className="flex items-center space-x-3">
                  <div className="text-purple-600">
                    {goal.icon}
                  </div>
                  <Label htmlFor={goal.id} className="text-lg font-semibold cursor-pointer">
                    {goal.label}
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">💡 Pro Tips</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Choose multiple goals to increase your opportunities</p>
          <p>• You can change these settings later in your profile</p>
          <p>• We'll match you with competitions based on your goals</p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center pt-6">
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={onboardingData.preferences.goals.length === 0}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl disabled:opacity-50"
        >
          Continue
        </Button>
        {onboardingData.preferences.goals.length === 0 && (
          <p className="text-sm text-red-600 mt-2">
            Please select at least one goal
          </p>
        )}
      </div>
    </div>
  );
}; 