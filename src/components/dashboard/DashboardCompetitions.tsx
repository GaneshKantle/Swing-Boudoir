import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Share, Calendar, Users, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockUserCompetitions = [
  {
    id: 1,
    name: "Hot Girl Summer - Barbados",
    status: "active",
    endDate: "2024-12-31",
    prize: "$500,000 cash prize, 2 tickets to Barbados",
    currentVotes: 847,
    ranking: 3,
    totalParticipants: 156,
    joined: true
  },
  {
    id: 2,
    name: "Big Game Competition",
    status: "completed",
    endDate: "2024-10-15",
    prize: "$100,000 cash prize",
    currentVotes: 1205,
    ranking: 2,
    totalParticipants: 89,
    joined: true
  }
];

const mockAvailableCompetitions = [
  {
    id: 3,
    name: "Workout Warrior",
    status: "upcoming",
    startDate: "2024-02-01",
    endDate: "2024-03-31",
    prize: "$250,000 cash prize + fitness brand sponsorship",
    totalParticipants: 0,
    joined: false
  },
  {
    id: 4,
    name: "Spring Fashion Week",
    status: "upcoming",
    startDate: "2024-03-15",
    endDate: "2024-04-30",
    prize: "$300,000 cash prize + modeling contract",
    totalParticipants: 0,
    joined: false
  }
];

export function DashboardCompetitions() {
  const { toast } = useToast();

  const shareCompetition = async (competitionName: string) => {
    const url = `${window.location.origin}/public-profile`; // Update with actual profile URL
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: `Your profile link for ${competitionName} has been copied.`,
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const joinCompetition = async (competitionId: number) => {
    // TODO: API call to join competition
    console.log(`Joining competition ${competitionId}`);
    toast({
      title: "Competition Joined!",
      description: "You have successfully joined the competition.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Competitions</h1>

      {/* User's Competitions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Competitions</h2>
        
        {mockUserCompetitions.length > 0 ? (
          <div className="grid gap-4">
            {mockUserCompetitions.map((competition) => (
              <Card key={competition.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      {competition.name}
                    </CardTitle>
                    {getStatusBadge(competition.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-2">{competition.prize}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        End Date: {competition.endDate}
                      </div>
                    </div>
                    
                    {competition.status === "active" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Current Votes:</span>
                          <Badge variant="outline">{competition.currentVotes}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Ranking:</span>
                          <Badge variant="secondary">#{competition.ranking} of {competition.totalParticipants}</Badge>
                        </div>
                      </div>
                    )}
                    
                    {competition.status === "completed" && (
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <Trophy className="mx-auto h-8 w-8 text-primary mb-2" />
                        <p className="font-semibold">You have completed this competition!</p>
                        <p className="text-sm text-muted-foreground">Final Ranking: #{competition.ranking}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => shareCompetition(competition.name)}
                      className="flex items-center"
                    >
                      <Share className="mr-2 h-4 w-4" />
                      Share Profile
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center p-8">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Competitions Completed Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't completed any competitions yet. Enter upcoming competitions to showcase your talent and start making your mark!
              </p>
              <Button>Browse Available Competitions</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Competitions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Available Competitions</h2>
        
        <div className="grid gap-4">
          {mockAvailableCompetitions.map((competition) => (
            <Card key={competition.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Gift className="mr-2 h-5 w-5" />
                    {competition.name}
                  </CardTitle>
                  {getStatusBadge(competition.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{competition.prize}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    Start: {competition.startDate}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    End: {competition.endDate}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {competition.totalParticipants} participants registered
                  </div>
                  <Button 
                    onClick={() => joinCompetition(competition.id)}
                    disabled={competition.joined}
                  >
                    {competition.joined ? "Joined" : "Join Competition"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}