import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Megaphone as Marketing, 
  Lock, 
  User, 
  Trash2, 
  LogOut,
  Cookie,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock settings data
const mockSettings = {
  notifications: {
    email: true,
    sms: false,
    marketing: true
  },
  privacy: {
    acceptAllCookies: false,
    acceptNecessaryCookies: true
  }
};

export function Settings() {
  const [settings, setSettings] = useState(mockSettings);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const { toast } = useToast();

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    
    // TODO: API call to update settings
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
    
    // TODO: API call to update settings
    toast({
      title: "Privacy Settings Updated",
      description: "Your cookie preferences have been saved.",
    });
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    // TODO: API call to change password
    console.log("Changing password");
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    
    setIsChangingPassword(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      // TODO: API call to delete account
      console.log("Deleting account");
      toast({
        title: "Account Deletion",
        description: "Your account deletion request has been submitted.",
      });
    }
  };

  const logout = () => {
    // TODO: Implement logout logic
    console.log("Logging out");
    window.location.href = "/";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Manage Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notifications" className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications.email}
              onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="sms-notifications" className="text-base font-medium">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive urgent updates via SMS
                </p>
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => updateNotificationSetting('sms', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Marketing className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="marketing-notifications" className="text-base font-medium">
                  Marketing Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive promotional offers and marketing content
                </p>
              </div>
            </div>
            <Switch
              id="marketing-notifications"
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => updateNotificationSetting('marketing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Private Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="jane.doe@example.com"
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support to change your email address
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              {!isChangingPassword && (
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(true)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              )}
            </div>

            {isChangingPassword && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={changePassword}>Save Password</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswords({ current: "", new: "", confirm: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <div>
                <Label className="text-base font-medium text-destructive">
                  Delete Account
                </Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
            </div>
            <Button variant="destructive" onClick={deleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label className="text-base font-medium">Log Out</Label>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cookies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cookie className="mr-2 h-5 w-5" />
            Cookies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="accept-all-cookies" className="text-base font-medium">
                  Accept all cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow all cookies for the best user experience
                </p>
              </div>
            </div>
            <Switch
              id="accept-all-cookies"
              checked={settings.privacy.acceptAllCookies}
              onCheckedChange={(checked) => updatePrivacySetting('acceptAllCookies', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cookie className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="accept-necessary-cookies" className="text-base font-medium">
                  Accept only necessary cookies
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only essential cookies required for basic functionality
                </p>
              </div>
            </div>
            <Switch
              id="accept-necessary-cookies"
              checked={settings.privacy.acceptNecessaryCookies}
              onCheckedChange={(checked) => updatePrivacySetting('acceptNecessaryCookies', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}