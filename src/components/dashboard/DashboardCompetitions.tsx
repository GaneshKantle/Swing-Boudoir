import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Share, Calendar, Users, Gift, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompetitions } from "@/hooks/useCompetitions";

export function DashboardCompetitions() {
  const { toast } = useToast();
  const { 
    competitions, 
    isLoading, 
    getActiveCompetitions, 
    getComingSoonCompetitions, 
    getEndedCompetitions 
  } = useCompetitions();

  const activeCompetitions = getActiveCompetitions();
  const comingSoonCompetitions = getComingSoonCompetitions();
  const endedCompetitions = getEndedCompetitions();

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

  const joinCompetition = async (competitionId: string) => {
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
      case "ended":
        return <Badge variant="secondary">Completed</Badge>;
      case "coming-soon":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Competitions</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading competitions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Competitions</h1>

      {/* Active Competitions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Competitions</h2>
        
        {activeCompetitions.length > 0 ? (
          <div className="grid gap-4">
            {activeCompetitions.map((competition) => (
              <Card key={competition.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      {competition.title}
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
                      {competition.location && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Users className="mr-1 h-4 w-4" />
                          Location: {competition.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Perks:</span>
                        <ul className="mt-1 space-y-1">
                          {competition.perks.slice(0, 3).map((perk, index) => (
                            <li key={index} className="text-muted-foreground">• {perk}</li>
                          ))}
                          {competition.perks.length > 3 && (
                            <li className="text-muted-foreground">• +{competition.perks.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => shareCompetition(competition.title)}
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
              <h3 className="text-lg font-semibold mb-2">No Active Competitions</h3>
              <p className="text-muted-foreground mb-4">
                There are no active competitions at the moment. Check back soon for new opportunities!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coming Soon Competitions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Upcoming Competitions</h2>
        
        <div className="grid gap-4">
          {comingSoonCompetitions.map((competition) => (
            <Card key={competition.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Gift className="mr-2 h-5 w-5" />
                    {competition.title}
                  </CardTitle>
                  {getStatusBadge(competition.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{competition.prize}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    End: {competition.endDate}
                  </div>
                  {competition.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      Location: {competition.location}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Perks:</span>
                    <ul className="mt-1 space-y-1">
                      {competition.perks.slice(0, 3).map((perk, index) => (
                        <li key={index} className="text-muted-foreground">• {perk}</li>
                      ))}
                      {competition.perks.length > 3 && (
                        <li className="text-muted-foreground">• +{competition.perks.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    0 participants registered
                  </div>
                  <Button 
                    onClick={() => joinCompetition(competition.id)}
                    disabled={true}
                  >
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {comingSoonCompetitions.length === 0 && (
          <Card>
            <CardContent className="text-center p-8">
              <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Upcoming Competitions</h3>
              <p className="text-muted-foreground">
                Check back soon for exciting new competitions!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ended Competitions */}
      {endedCompetitions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Completed Competitions</h2>
          
          <div className="grid gap-4">
            {endedCompetitions.map((competition) => (
              <Card key={competition.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      {competition.title}
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
                        Ended: {competition.endDate}
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <Trophy className="mx-auto h-8 w-8 text-primary mb-2" />
                      <p className="font-semibold">Competition Completed</p>
                      <p className="text-sm text-muted-foreground">Final results available</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}