import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Heart, 
  Star, 
  Camera, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function WelcomeStep() {
  const features = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Win Competitions",
      description: "Participate in exciting contests and win amazing prizes"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Build Your Fanbase",
      description: "Connect with voters and grow your community"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Get Voted",
      description: "Receive votes from fans and climb the leaderboards"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Showcase Talent",
      description: "Display your portfolio and highlight your best work"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Connect with people from around the world"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Features",
      description: "Access exclusive tools and advanced analytics"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Models" },
    { number: "50K+", label: "Happy Voters" },
    { number: "100+", label: "Competitions" },
    { number: "1M+", label: "Votes Cast" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200"
        >
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          <span className="text-purple-700 font-medium">Welcome to Swing Boudoir</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent"
        >
          Your Journey Starts Here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          Join thousands of models who have found success, built their fanbase, and won amazing prizes. 
          Let's create your perfect profile and get you started on your path to stardom.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center space-x-2"
        >
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Free to Join
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Instant Setup
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Global Community
          </Badge>
        </motion.div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-1">
              {stat.number}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 + index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <Card className="h-full border-2 border-transparent hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto text-white"
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="text-center space-y-6"
      >
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.6, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ArrowRight className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            >
              Ready to Get Started?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Let's set up your profile and get you ready to compete. 
              It only takes a few minutes to create your perfect profile!
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          <span>Step 1 of 7</span>
        </div>
      </motion.div>
    </motion.div>
  );
} 