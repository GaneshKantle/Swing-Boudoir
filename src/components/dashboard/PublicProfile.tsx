import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Share2,
  AlertCircle,
  Eye,
  Clock,
  RefreshCw,
  Gift,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { apiRequest } from '@/lib/api';
import { useCompetitions } from '@/hooks/useCompetitions';
import { Competition as CompetitionType } from '@/types/competitions.types';
import { formatUsdAbbrev } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  modelId: string;
  profileImage?: string;
  votingImage?: string;
  hobbies?: string;
  paidVoterMessage?: string;
  freeVoterMessage?: string;
  portfolioPhotos?: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  totalVotes: number;
  ranking: number;
  totalParticipants: number;
  votesNeededForFirst: number;
  totalCompetitions: number;
  activeCompetitions: number;
  completedCompetitions: number;
  totalEarnings: number;
}

export function PublicProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const { joinedCompetitions, isLoadingJoined } = useCompetitions();

  const fetchUserData = useCallback(async () => {
    try {
      setError(null);

      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const profileResponse = await apiRequest(`/api/v1/users/${user?.id}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.success) {
        const profileData = profileResponse.data;
        setUserProfile(profileData);
      }

      // Fetch user stats
      const statsResponse = await apiRequest(`/api/v1/users/${user?.id}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.success) {
        const statsData = statsResponse.data;
        setUserStats(statsData);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.username) {
      fetchUserData();
    }
  }, [user?.username, fetchUserData]);

  // Countdown timer for joined contests
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: string]: string } = {};
      
      (joinedCompetitions || []).forEach((competition: CompetitionType) => {
        const now = new Date().getTime();
        const end = new Date(competition.endDate).getTime();
        const difference = end - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[competition.id] = `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        } else {
          newTimeLeft[competition.id] = "Ended";
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [joinedCompetitions]);

  const shareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${user?.username}`;
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied!",
        description: "Share this link with your supporters to get more votes.",
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast({
        title: "Error sharing profile",
        description: "Failed to copy profile link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const computeStatusForContest = (contest: CompetitionType): 'active' | 'coming-soon' | 'ended' => {
    const now = new Date();
    const start = new Date(contest.startDate);
    const end = new Date(contest.endDate);
    if (now < start) return 'coming-soon';
    if (now > end) return 'ended';
    return 'active';
  };

  const getStatusBadge = (status: "active" | "coming-soon" | "ended") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "ended":
        return <Badge variant="secondary">Completed</Badge>;
      case "coming-soon":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeCompetitions = (joinedCompetitions || []).filter(comp => computeStatusForContest(comp) === 'active');
  const comingSoonCompetitions = (joinedCompetitions || []).filter(comp => computeStatusForContest(comp) === 'coming-soon');
  const endedCompetitions = (joinedCompetitions || []).filter(comp => computeStatusForContest(comp) === 'ended');

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Public Profile</h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Error loading profile</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchUserData} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Public Profile</h1>
        <div className="flex items-center space-x-2">
          <Link 
            to={`/profile/${user?.username}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </Link>
          <Button onClick={shareProfile} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
           <Button onClick={shareProfile} variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Profile Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{userStats?.totalVotes || 0}</p>
                <p className="text-sm text-muted-foreground">Total Votes</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">#{userStats?.ranking || 0}</p>
                <p className="text-sm text-muted-foreground">Current Rank</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{joinedCompetitions?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Competitions</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatUsdAbbrev(userStats?.totalEarnings || 0)}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
              <Gift className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              {userProfile?.profileImage ? (
                <img 
                  src={userProfile.profileImage} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{user?.name || 'User'}</h2>
              <p className="text-muted-foreground mb-4">{userProfile?.bio || 'No bio available'}</p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-1">Profile URL</p>
                <code className="text-sm break-all">{window.location.origin}/profile/{user?.username}</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Competitions */}
      {activeCompetitions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Active Competitions</h2>
          <div className="grid grid-cols-1 gap-4">
            {activeCompetitions.map((competition: CompetitionType) => (
              <Card key={competition.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      {competition.name}
                    </CardTitle>
                    {getStatusBadge('active')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-2">{formatUsdAbbrev(competition.prizePool)} Prize Pool</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{timeLeft[competition.id] || "Loading..."}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button variant="outline" onClick={shareProfile}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Competitions */}
      {comingSoonCompetitions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Upcoming Competitions</h2>
          <div className="grid grid-cols-1 gap-4">
            {comingSoonCompetitions.map((competition: CompetitionType) => (
              <Card key={competition.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Gift className="mr-2 h-5 w-5" />
                      {competition.name}
                    </CardTitle>
                    {getStatusBadge('coming-soon')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-2">{formatUsdAbbrev(competition.prizePool)} Prize Pool</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Starts: {formatDistanceToNow(new Date(competition.startDate), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Competitions */}
      {endedCompetitions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Completed Competitions</h2>
          <div className="grid grid-cols-1 gap-4">
            {endedCompetitions.map((competition: CompetitionType) => (
              <Card key={competition.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      {competition.name}
                    </CardTitle>
                    {getStatusBadge('ended')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-2">{formatUsdAbbrev(competition.prizePool)} Prize Pool</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Ended: {formatDistanceToNow(new Date(competition.endDate), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button variant="outline">
                        View Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No competitions message */}
      {isLoadingJoined ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading competitions...</p>
          </div>
        </div>
      ) : (joinedCompetitions?.length || 0) === 0 && (
        <Card>
          <CardContent className="text-center p-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Competitions Joined</h3>
            <p className="text-muted-foreground mb-4">You haven't joined any competitions yet.</p>
            <Button>Explore Competitions</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}