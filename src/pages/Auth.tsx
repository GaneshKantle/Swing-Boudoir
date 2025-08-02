/**
 * Authentication Page Component
 * 
 * This component provides:
 * - Authentication modal integration
 * - Professional UI design
 * - Loading states and error handling
 * - Responsive design for all devices
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Users, Trophy, LogIn } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle authentication modal
   */
  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  // Features list for the landing page
  const features = [
    {
      icon: Trophy,
      title: "Exclusive Competitions",
      description: "Join prestigious modeling competitions with amazing prizes"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with models from around the world"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your privacy and security are our top priority"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Features */}
        <div className="hidden lg:block text-white space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Swing Boudoir
              </span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Join the most prestigious modeling platform and compete for life-changing opportunities.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <div className="flex items-center space-x-4 text-white/70">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent/80 border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm">Join 25,000+ models worldwide</span>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Get Started
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Sign in with your Google account to access the platform
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Authentication Button */}
              <Button
                onClick={handleAuthClick}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 transition-all duration-200 flex items-center justify-center gap-3 h-12 text-base font-medium shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Get Started
              </Button>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                    Secure Authentication
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Your data is protected with industry-standard security</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  By continuing, you agree to our Terms of Service and Privacy Policy. 
                  We only request access to your basic profile information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Auth; 