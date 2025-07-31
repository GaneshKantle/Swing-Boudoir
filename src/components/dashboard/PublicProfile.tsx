import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, Heart, Clock, Trophy, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockProfile = {
  name: "Jane Doe",
  bio: "Model and fitness enthusiast passionate about empowering others.",
  totalVotes: 1247,
  ranking: 3,
  totalParticipants: 156,
  votesNeededForFirst: 89
};

const mockCompetitions = [
  {
    id: 1,
    name: "Hot Girl Summer - Barbados",
    endDate: new Date("2024-12-31T23:59:59"),
    prize: "$500,000 cash prize, 2 tickets to Barbados",
    currentVotes: 847,
    ranking: 3
  },
  {
    id: 2,
    name: "Big Game Competition",
    endDate: new Date("2024-11-15T23:59:59"),
    prize: "$100,000 cash prize",
    currentVotes: 400,
    ranking: 7
  }
];

export function PublicProfile() {
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});
  const [userVotes, setUserVotes] = useState(0);
  const [lastVoteTime, setLastVoteTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: number]: string } = {};
      mockCompetitions.forEach(comp => {
        const now = new Date().getTime();
        const end = comp.endDate.getTime();
        const difference = end - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          newTimeLeft[comp.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[comp.id] = "Ended";
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const canVote = () => {
    if (!lastVoteTime) return true;
    const now = new Date();
    const hoursSinceLastVote = (now.getTime() - lastVoteTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastVote >= 24;
  };

  const getTimeUntilNextVote = () => {
    if (!lastVoteTime) return null;
    const now = new Date();
    const nextVoteTime = new Date(lastVoteTime.getTime() + 24 * 60 * 60 * 1000);
    const hoursLeft = Math.ceil((nextVoteTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    return hoursLeft;
  };

  const handleVote = async () => {
    if (canVote()) {
      // TODO: API call to submit vote
      console.log("Submitting vote");
      setUserVotes(prev => prev + 1);
      setLastVoteTime(new Date());
      toast({
        title: "Vote Submitted!",
        description: "Your vote has been counted successfully.",
      });
    } else {
      const hoursLeft = getTimeUntilNextVote();
      toast({
        title: "Vote Limit Reached",
        description: `You must wait ${hoursLeft} hours to vote again.`,
        variant: "destructive"
      });
    }
  };

  const handlePremiumVote = () => {
    // TODO: Navigate to premium voting/payment
    console.log("Redirecting to premium voting");
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{mockProfile.name}</h1>
        <Button onClick={shareProfile} variant="outline">
          <Share className="mr-2 h-4 w-4" />
          Share Profile
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">{mockProfile.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{mockProfile.name}</h2>
              <p className="text-muted-foreground mt-2">{mockProfile.bio}</p>
            </div>
            <div className="flex justify-center gap-4">
              <Badge variant="secondary">
                {mockProfile.totalVotes} Total Votes
              </Badge>
              <Badge variant="outline">
                Rank #{mockProfile.ranking} of {mockProfile.totalParticipants}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voting Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Vote for {mockProfile.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You have cast {userVotes} votes for {mockProfile.name}
            </p>
            
            {canVote() ? (
              <Button onClick={handleVote} size="lg" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Vote for {mockProfile.name}
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-destructive">
                  You must wait {getTimeUntilNextVote()} hours to vote again.
                </p>
                <Button onClick={handlePremiumVote} variant="outline" size="lg" className="w-full">
                  Vote Again Now (Premium)
                </Button>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Premium Voting Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={handlePremiumVote}>
                20 votes for $10
              </Button>
              <Button variant="outline" onClick={handlePremiumVote}>
                40 votes for $20
              </Button>
              <Button variant="outline" onClick={handlePremiumVote}>
                60 votes for $30
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Competitions</h2>
        {mockCompetitions.map((competition) => (
          <Card key={competition.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  {competition.name}
                </CardTitle>
                <Badge variant="secondary">
                  Rank #{competition.ranking}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{competition.prize}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Time remaining: {timeLeft[competition.id]}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {competition.currentVotes} votes
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                There are {mockProfile.totalParticipants} participants. 
                You are currently ranked #{mockProfile.ranking}. 
                You need {mockProfile.votesNeededForFirst} more votes to reach #1.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}