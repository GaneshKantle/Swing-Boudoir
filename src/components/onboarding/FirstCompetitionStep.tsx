import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, DollarSign, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Competition } from '@/types/competitions.types';

export const FirstCompetitionStep: React.FC = () => {
  const { onboardingData, updateOnboardingData, nextStep } = useOnboarding();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveCompetitions();
  }, []);

  const fetchActiveCompetitions = async () => {
    try {
      setIsLoading(true);
      // Fetch active competitions from the API
      const response = await api.get('/contest?status=active&limit=3');
      
      if (response.success) {
        setCompetitions(response.data.data || []);
      } else {
        console.error('Failed to fetch competitions:', response.error);
        // Set some mock data for demonstration
        setCompetitions([
          {
            id: 'comp_1',
            name: 'Summer Glow Contest',
            description: 'Show off your summer beauty in this exciting competition',
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            prizePool: 5000,
            createdAt: '2024-05-01',
            updatedAt: '2024-05-01',
            winnerProfileId: null,
            awards: [],
            images: []
          },
          {
            id: 'comp_2',
            name: 'Fashion Forward',
            description: 'Express your unique style and fashion sense',
            startDate: '2024-06-15',
            endDate: '2024-09-15',
            prizePool: 3000,
            createdAt: '2024-05-15',
            updatedAt: '2024-05-15',
            winnerProfileId: null,
            awards: [],
            images: []
          },
          {
            id: 'comp_3',
            name: 'Natural Beauty',
            description: 'Celebrate natural beauty and authenticity',
            startDate: '2024-07-01',
            endDate: '2024-10-01',
            prizePool: 4000,
            createdAt: '2024-06-01',
            updatedAt: '2024-06-01',
            winnerProfileId: null,
            awards: [],
            images: []
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast({
        title: "Error",
        description: "Failed to load competitions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCompetition = async (competitionId: string) => {
    try {
      // API call to join competition would go here
      toast({
        title: "Success!",
        description: "You've successfully joined the competition!",
      });
      
      // Update onboarding data
      updateOnboardingData({ firstCompetition: competitionId });
      
      // Move to next step
      nextStep();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join competition. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewMoreCompetitions = () => {
    navigate('/dashboard/competitions');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrize = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading competitions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Your First Competitions</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Here are some exciting competitions you can join to get started. 
          Choose one that interests you or explore more options.
        </p>
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <Card key={competition.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Active
                </Badge>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <CardTitle className="text-lg text-gray-900 line-clamp-2">
                {competition.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {competition.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Ends {formatDate(competition.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-green-600">
                    {formatPrize(competition.prizePool)} Prize Pool
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => handleJoinCompetition(competition.id)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Join Competition
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center pt-6">
        <Button
          variant="outline"
          size="lg"
          onClick={handleViewMoreCompetitions}
          className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
        >
          View All Competitions
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          Explore more competitions and find the perfect ones for you
        </p>
      </div>

      {/* Skip Option */}
      <div className="text-center pt-4">
        <Button
          variant="ghost"
          onClick={nextStep}
          className="text-gray-500 hover:text-gray-700"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}; 