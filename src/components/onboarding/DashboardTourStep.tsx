import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  Trophy, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  ArrowRight
} from 'lucide-react';

export const DashboardTourStep: React.FC = () => {
  const { completeOnboarding } = useOnboarding();
  const navigate = useNavigate();

  const handleCompleteOnboarding = async () => {
    try {
      await completeOnboarding();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const dashboardFeatures = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated with competition updates, votes, and important messages'
    },
    {
      icon: Trophy,
      title: 'Competitions',
      description: 'View all your active competitions and join new ones'
    },
    {
      icon: Users,
      title: 'Public Profile',
      description: 'Manage how others see your profile and photos'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track your performance, votes, and earnings'
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Customize your account and privacy preferences'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard!</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          You're all set! Your dashboard is your command center for everything Swing Boudoir. 
          Here's what you can do from here.
        </p>
      </div>

      {/* Dashboard Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h3>
        <p className="text-gray-600 mb-6">
          You're now ready to start your journey with Swing Boudoir. 
          Your profile is set up and you can begin participating in competitions right away.
        </p>
        <Button
          onClick={handleCompleteOnboarding}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}; 