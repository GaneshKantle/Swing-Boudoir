import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Edit, Save, Trash2 } from "lucide-react";

// Mock data - replace with API calls
const mockProfile = {
  name: "Jane Doe",
  bio: "Model and fitness enthusiast passionate about empowering others.",
  charity: "american-red-cross",
  charityReason: "I believe in helping communities during disasters and emergencies.",
  hobbies: "Fitness, Photography, Traveling, Cooking",
  voterMessage: "Thank you for supporting me! Your vote means the world to me.",
  freeVoterMessage: "Every vote counts! Thank you for your support."
};

const charities = [
  { value: "american-red-cross", label: "American Red Cross" },
  { value: "unicef", label: "UNICEF" },
  { value: "doctors-without-borders", label: "Doctors Without Borders" },
  { value: "world-wildlife-fund", label: "World Wildlife Fund" },
  { value: "habitat-for-humanity", label: "Habitat for Humanity" },
];

export function EditProfile() {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);

  const saveProfile = async () => {
    // TODO: API call to save profile
    console.log("Saving profile:", profile);
    // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(profile) });
    setIsEditing(false);
  };

  const uploadImage = async (type: 'profile' | 'voting', file: File) => {
    // TODO: API call to upload image
    console.log(`Uploading ${type} image:`, file.name);
    // const formData = new FormData();
    // formData.append('image', file);
    // await fetch(`/api/images/${type}`, { method: 'POST', body: formData });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
        <Button 
          onClick={isEditing ? saveProfile : () => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Profile Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio / Short Introduction</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="hobbies">Hobbies</Label>
              <Textarea
                id="hobbies"
                value={profile.hobbies}
                onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                disabled={!isEditing}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Charity Information */}
        <Card>
          <CardHeader>
            <CardTitle>Charity Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="charity">Which charity would you like to support if you win?</Label>
              <Select 
                value={profile.charity}
                onValueChange={(value) => setProfile({ ...profile, charity: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a charity" />
                </SelectTrigger>
                <SelectContent>
                  {charities.map((charity) => (
                    <SelectItem key={charity.value} value={charity.value}>
                      {charity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="charityReason">Why did you choose this cause?</Label>
              <Textarea
                id="charityReason"
                value={profile.charityReason}
                onChange={(e) => setProfile({ ...profile, charityReason: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voter Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages for Voters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="voterMessage">Message for voters who purchased MAXIM Next votes from your profile</Label>
            <Textarea
              id="voterMessage"
              value={profile.voterMessage}
              onChange={(e) => setProfile({ ...profile, voterMessage: e.target.value })}
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="freeVoterMessage">Message for Free Voters</Label>
            <Textarea
              id="freeVoterMessage"
              value={profile.freeVoterMessage}
              onChange={(e) => setProfile({ ...profile, freeVoterMessage: e.target.value })}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Photos (Up to 20 images)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Drop images here or click to upload</p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Profile Photos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voting Photos (Up to 100 images)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Only visible to voters. Each vote unlocks one image (20 at a time).
            </p>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Drop images here or click to upload</p>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Voting Photos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competition Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Competition Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock competition data */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Hot Girl Summer - Barbados</h4>
              <p className="text-sm text-muted-foreground">Grand Prize: $500,000 cash prize, 2 tickets to Barbados</p>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Photos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}