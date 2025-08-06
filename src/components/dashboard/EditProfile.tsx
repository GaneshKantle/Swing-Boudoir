import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Edit, Save, Trash2, X, Trophy, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing, uploadFiles } from "@/lib/uploadthing";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

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
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [votingImages, setVotingImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { getModelRegistrations, getCompetitionById } = useCompetitions();
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const votingFileInputRef = useRef<HTMLInputElement>(null);

  // Get user's registered competitions
  const modelRegistrations = user ? getModelRegistrations(user.id) : [];

  // Listen for registration changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'modelRegistrations') {
        // Force re-render by updating a state
        setProfile(prev => ({ ...prev }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { startUpload, routeConfig } = useUploadThing("profileImages", {
    // onClientUploadComplete: () => {
    //   alert("uploaded successfully!");
    // },
    // onUploadError: () => {
    //   alert("error occurred while uploading");
    // },
    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName);
    },
  });

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: API call to save profile
      console.log("Saving profile:", profile);
      // await fetch('/api/profile', { method: 'PUT', body: JSON.stringify(profile) });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (type: 'profile' | 'voting', files: FileList | null) => {
    if (!files) return;

    const maxImages = type === 'profile' ? 20 : 100;
    const currentImages = type === 'profile' ? profileImages.length : votingImages.length;

    if (currentImages + files.length > maxImages) {
      toast({
        title: "Too Many Images",
        description: `You can only upload up to ${maxImages} images for ${type} photos.`,
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select only image files.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (type === 'profile') {
          setProfileImages(prev => [...prev, imageUrl]);
        } else {
          setVotingImages(prev => [...prev, imageUrl]);
        }
      };
      reader.readAsDataURL(file);
    });

    startUpload(Array.from(files))


    toast({
      title: "Images Uploaded!",
      description: `${files.length} image(s) have been uploaded successfully.`,
    });
  };

  const removeImage = (type: 'profile' | 'voting', index: number) => {
    if (type === 'profile') {
      setProfileImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setVotingImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <Button 
          onClick={isEditing ? saveProfile : () => setIsEditing(true)}
          className="flex items-center gap-2"
          disabled={isSaving}
          size="sm"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? (isSaving ? "Saving..." : "Save Changes") : "Edit Profile"}
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
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
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
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
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
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
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
                <SelectTrigger className={!isEditing ? "bg-muted cursor-not-allowed" : ""}>
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
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
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
              className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
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
              className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
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
            <input
              type="file"
              ref={profileFileInputRef}
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload('profile', e.target.files)}
              className="hidden"
              aria-label="Upload profile photos"
            />
            
            {profileImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {profileImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage('profile', index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove profile image ${index + 1}`}
                      title={`Remove profile image ${index + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {profileImages.length}/20 images uploaded
              </p>
              <Button 
                variant="outline"
                onClick={() => profileFileInputRef.current?.click()}
                disabled={profileImages.length >= 20}
              >
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
            <input
              type="file"
              ref={votingFileInputRef}
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload('voting', e.target.files)}
              className="hidden"
              aria-label="Upload voting photos"
            />
            
            {votingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {votingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Voting ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage('voting', index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove voting image ${index + 1}`}
                      title={`Remove voting image ${index + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {votingImages.length}/100 images uploaded
              </p>
              <Button 
                variant="outline"
                onClick={() => votingFileInputRef.current?.click()}
                disabled={votingImages.length >= 100}
              >
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
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Competition Enrollments ({modelRegistrations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modelRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No Competitions Registered</h4>
              <p className="text-muted-foreground mb-4">
                You haven't registered for any competitions yet.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/competitions'}>
                Browse Competitions
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {modelRegistrations.map((registration) => {
                const competition = getCompetitionById(registration.competitionId);
                if (!competition) return null;

                return (
                  <div key={registration.competitionId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{competition.title}</h4>
                      <Badge variant={competition.status === 'active' ? 'default' : 'secondary'}>
                        {competition.status === 'active' ? 'Active' : competition.status === 'coming-soon' ? 'Coming Soon' : 'Ended'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{competition.prize}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>Registered: {new Date(registration.registeredAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="mr-1 h-4 w-4" />
                        <span>{registration.currentVotes || 0} votes</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Photos
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}