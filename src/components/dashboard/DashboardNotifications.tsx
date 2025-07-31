import { Bell, Trophy, Users, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data - replace with API calls to your backend
const mockNotifications = [
  {
    id: 1,
    type: "competition",
    title: "New Competition: Hot Girl Summer - Barbados",
    message: "Participate in this contest/competition. Registration ends in 3 days!",
    time: "2 hours ago",
    unread: true,
    icon: Trophy
  },
  {
    id: 2,
    type: "vote",
    title: "You received 5 new votes!",
    message: "Anonymous voted for you in Big Game Competition",
    time: "4 hours ago",
    unread: true,
    icon: Heart
  },
  {
    id: 3,
    type: "winner",
    title: "Congratulations! You won!",
    message: "You've won the Workout Warrior contest — here's what's next: Check your prize history for details.",
    time: "1 day ago",
    unread: false,
    icon: Trophy
  },
  {
    id: 4,
    type: "tip",
    title: "Competition Tips & Tricks",
    message: "Watch our latest video guide on how to maximize your votes and engagement.",
    time: "2 days ago",
    unread: false,
    icon: Users
  }
];

export function DashboardNotifications() {
  // TODO: Replace with actual API call
  const fetchNotifications = async () => {
    // const response = await fetch('/api/notifications');
    // return response.json();
    return mockNotifications;
  };

  const markAsRead = async (notificationId: number) => {
    // TODO: API call to mark notification as read
    console.log(`Marking notification ${notificationId} as read`);
    // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
  };

  const markAllAsRead = async () => {
    // TODO: API call to mark all notifications as read
    console.log("Marking all notifications as read");
    // await fetch('/api/notifications/read-all', { method: 'POST' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-colors ${
                notification.unread ? 'bg-primary/5 border-primary/20' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                      {notification.unread && (
                        <Badge variant="secondary" className="mt-1">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{notification.message}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            FAQs & Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">How do I decide which competition I want my votes to count towards?</h4>
            <p className="text-sm text-muted-foreground">
              You can select your active competition in your profile settings. All votes will count towards your currently selected competition.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Competition Levels & Guidance</h4>
            <p className="text-sm text-muted-foreground">
              Each competition has multiple levels. Complete lower levels to unlock higher tiers with bigger prizes.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">New User Guide</h4>
            <p className="text-sm text-muted-foreground">
              Welcome! Start by completing your profile, uploading photos, and joining your first competition.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}