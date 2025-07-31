import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Users, DollarSign, MessageSquare } from "lucide-react";

// Mock data for votes
const mockTopVoters = [
  { voter: "Anonymous", votes: 15, comment: "You're amazing! Keep going!", time: "Yesterday" },
  { voter: "Anonymous", votes: 12, comment: "-", time: "2 days ago" },
  { voter: "Anonymous", votes: 8, comment: "Rooting for you!", time: "3 days ago" },
  { voter: "Anonymous", votes: 7, comment: "-", time: "4 days ago" },
  { voter: "Anonymous", votes: 5, comment: "Best of luck!", time: "5 days ago" },
  { voter: "Anonymous", votes: 4, comment: "-", time: "6 days ago" },
  { voter: "Anonymous", votes: 3, comment: "-", time: "1 week ago" },
  { voter: "Anonymous", votes: 2, comment: "-", time: "1 week ago" },
  { voter: "Anonymous", votes: 2, comment: "You deserve to win!", time: "1 week ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "2 weeks ago" }
];

const mockRecentVotes = [
  { voter: "Anonymous", votes: 1, comment: "-", time: "2 hours ago" },
  { voter: "Anonymous", votes: 3, comment: "You're fantastic!", time: "5 hours ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "Yesterday" },
  { voter: "Anonymous", votes: 2, comment: "-", time: "Yesterday" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "2 days ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "3 days ago" },
  { voter: "Anonymous", votes: 4, comment: "Go get 'em!", time: "4 days ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "5 days ago" },
  { voter: "Anonymous", votes: 2, comment: "-", time: "6 days ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "1 week ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "1 week ago" },
  { voter: "Anonymous", votes: 3, comment: "You're the best!", time: "1 week ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "1 week ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "2 weeks ago" },
  { voter: "Anonymous", votes: 2, comment: "-", time: "2 weeks ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "2 weeks ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "2 weeks ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "3 weeks ago" },
  { voter: "Anonymous", votes: 2, comment: "Keep it up!", time: "3 weeks ago" },
  { voter: "Anonymous", votes: 1, comment: "-", time: "3 weeks ago" }
];

const mockPremiumVotes = [
  { 
    comment: "10 HGS Barbados Prize Votes from Hot Girl Summer - Barbados Level 1", 
    votes: 10, 
    time: "1 day ago" 
  },
  { 
    comment: "5 HGS Barbados Prize Votes from Hot Girl Summer - Barbados Level 1", 
    votes: 5, 
    time: "2 days ago" 
  },
  { 
    comment: "20 Premium Votes Package", 
    votes: 20, 
    time: "1 week ago" 
  },
  { 
    comment: "15 Big Game Competition Premium Votes", 
    votes: 15, 
    time: "2 weeks ago" 
  }
];

const mockVoteStats = {
  totalVotes: 1247,
  freeVotes: 1185,
  premiumVotes: 62,
  totalVoters: 89,
  averageVotesPerVoter: 14.0
};

export function Votes() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Votes</h1>

      {/* Vote Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold">{mockVoteStats.totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Free Votes</p>
                <p className="text-2xl font-bold">{mockVoteStats.freeVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Premium Votes</p>
                <p className="text-2xl font-bold">{mockVoteStats.premiumVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Voters</p>
                <p className="text-2xl font-bold">{mockVoteStats.totalVoters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voter Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Voter Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Top 10 Voters */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top 10 Voters</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voter</TableHead>
                    <TableHead>Number of Votes</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopVoters.map((vote, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{vote.voter}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{vote.votes}</Badge>
                      </TableCell>
                      <TableCell>
                        {vote.comment !== "-" && (
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            {vote.comment}
                          </div>
                        )}
                        {vote.comment === "-" && <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{vote.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Note about free votes */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Free votes shown below may include both legitimate and fraudulent votes.
              </p>
            </div>

            {/* Last 20 Votes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Last 20 Votes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voter</TableHead>
                    <TableHead>Number of Votes</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentVotes.slice(0, 20).map((vote, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{vote.voter}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vote.votes}</Badge>
                      </TableCell>
                      <TableCell>
                        {vote.comment !== "-" && (
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            {vote.comment}
                          </div>
                        )}
                        {vote.comment === "-" && <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{vote.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Votes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Last 50 Premium Votes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Number of Votes</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPremiumVotes.map((vote, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{vote.comment}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">{vote.votes}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{vote.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}