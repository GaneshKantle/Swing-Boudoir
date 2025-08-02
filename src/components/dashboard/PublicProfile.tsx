import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, ExternalLink, Eye, Users, Trophy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// API endpoints for real data integration
const API_ENDPOINTS = {
  getUserProfile: '/api/user/profile',
  getUserCompetitions: '/api/user/competitions',
  getUserStats: '/api/user/stats'
};

// Types for API responses
interface UserProfile {
  name: string;
  bio: string;
  modelId: string;
  image?: string;
}

interface UserStats {
  totalVotes: number;
  ranking: number;
  totalParticipants: number;
  votesNeededForFirst: number;
}

interface Competition {
  id: number;
  name: string;
  endDate: string;
  prize: string;
  currentVotes: number;
  ranking: number;
  status: 'active' | 'ended' | 'upcoming';
}

// Mock data for development - replace with API calls
const mockProfile: UserProfile = {
  name: "Jazira Murphy",
  bio: "Model and fitness enthusiast passionate about empowering others.",
  modelId: "LXoab"
};

const mockStats: UserStats = {
  totalVotes: 0,
  ranking: 0,
  totalParticipants: 0,
  votesNeededForFirst: 0
};

const mockCompetitions: Competition[] = [];

export function PublicProfile() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [stats, setStats] = useState<UserStats>(mockStats);
  const [competitions, setCompetitions] = useState<Competition[]>(mockCompetitions);
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // TODO: Replace with actual API calls
        // const profileResponse = await fetch(API_ENDPOINTS.getUserProfile);
        // const statsResponse = await fetch(API_ENDPOINTS.getUserStats);
        // const competitionsResponse = await fetch(API_ENDPOINTS.getUserCompetitions);
        
        // const profileData = await profileResponse.json();
        // const statsData = await statsResponse.json();
        // const competitionsData = await competitionsResponse.json();
        
        // setProfile(profileData);
        // setStats(statsData);
        // setCompetitions(competitionsData);
        
        // For now, using mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setProfile(mockProfile);
        setStats(mockStats);
        setCompetitions(mockCompetitions);
        
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  // Countdown timer for competitions
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: number]: string } = {};
      competitions.forEach(comp => {
        const now = new Date().getTime();
        const end = new Date(comp.endDate).getTime();
        const difference = end - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[comp.id] = `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        } else {
          newTimeLeft[comp.id] = "Ended";
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [competitions]);

  const shareProfile = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Profile link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Public Profile</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Public Profile</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your public profile and track progress
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            to={`/model/${profile.modelId}`}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
          >
            <Eye className="mr-1.5 h-3 w-3" />
            View Profile
          </Link>
          <Button onClick={shareProfile} variant="outline" size="sm" className="text-xs px-3 py-1.5">
            <Share className="mr-1.5 h-3 w-3" />
            Share
          </Button>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{profile.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold">{profile.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{profile.bio}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{stats.totalVotes}</div>
              <div className="text-xs text-muted-foreground">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">#{stats.ranking}</div>
              <div className="text-xs text-muted-foreground">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{stats.totalParticipants}</div>
              <div className="text-xs text-muted-foreground">Participants</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share URL */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm mb-0.5">Your Profile URL</h3>
              <p className="text-xs text-muted-foreground">
                Share this link to get more votes
              </p>
            </div>
            <Button onClick={shareProfile} variant="outline" size="sm" className="text-xs px-3 py-1.5">
              <Share className="mr-1.5 h-3 w-3" />
              Copy
            </Button>
          </div>
          <div className="bg-muted p-2 rounded-md mt-2">
            <code className="text-xs break-all">https://vip.covergirl.maxim.com/model/{profile.modelId}</code>
          </div>
        </CardContent>
      </Card>

      {/* Competitions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">Active Competitions</h3>
              <p className="text-xs text-muted-foreground">
                {competitions.length} competition{competitions.length !== 1 ? 's' : ''} active
              </p>
            </div>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </div>
          
          {competitions.length === 0 ? (
            <div className="text-center py-6">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active competitions</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check back later for new opportunities
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {competitions.map((competition) => (
                <div key={competition.id} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-medium text-xs">{competition.name}</h4>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      Rank #{competition.ranking}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5">{competition.prize}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{timeLeft[competition.id] || "Loading..."}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}