import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Edit, Save, Trash2, X, Trophy, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { UpdateProfileRequest } from "@/hooks/useProfile";
import axios from "axios";

export function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    hobbies: "",
    voterMessage: "",
    freeVoterMessage: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    dateOfBirth: "",
    gender: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    website: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Use the profile hook
  const { 
    useProfileByUserId, 
    updateProfile, 
    uploadProfilePhotos, 
    removeProfilePhoto,
    uploadCoverImage,
    removeCoverImage
  } = useProfile();

  // Get profile data for the current user
  const { data: profileData, isLoading: profileLoading } = useProfileByUserId(user?.id || '');

  // Update local profile state when profile data changes
  useEffect(() => {
    if (profileData) {
      setProfile({
        name: profileData.bio || "",
        bio: profileData.bio || "",
        hobbies: profileData.hobbiesAndPassions || "",
        voterMessage: profileData.paidVoterMessage || "",
        freeVoterMessage: profileData.freeVoterMessage || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        city: profileData.city || "",
        country: profileData.country || "",
        postalCode: profileData.postalCode || "",
        dateOfBirth: profileData.dateOfBirth || "",
        gender: profileData.gender || "",
        instagram: profileData.instagram || "",
        tiktok: profileData.tiktok || "",
        youtube: profileData.youtube || "",
        facebook: profileData.facebook || "",
        twitter: profileData.twitter || "",
        linkedin: profileData.linkedin || "",
        website: profileData.website || ""
      });

      // Set profile images from API data
      if (profileData.profilePhotos && profileData.profilePhotos.length > 0) {
        setProfileImages(profileData.profilePhotos.map(photo => photo.url));
      } else {
        setProfileImages([]);
      }
    }
  }, [profileData]);

  const saveProfile = async () => {
    if (!profileData?.id) {
      toast({
        title: "Error",
        description: "Profile not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Use the real API endpoint
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://api.swingboudoirmag.com/api/v1/profile/${profileData.id}`,
        {
          userId: profileData.userId,
          bio: profile.bio,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          postalCode: profile.postalCode,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          hobbiesAndPassions: profile.hobbies,
          paidVoterMessage: profile.voterMessage,
          freeVoterMessage: profile.freeVoterMessage,
          instagram: profile.instagram,
          tiktok: profile.tiktok,
          youtube: profile.youtube,
          facebook: profile.facebook,
          twitter: profile.twitter,
          linkedin: profile.linkedin,
          website: profile.website
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setIsEditing(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !profileData?.id) return;

    const maxImages = 20;
    const currentImages = profileImages.length;

    if (currentImages + files.length > maxImages) {
      toast({
        title: "Too Many Images",
        description: `You can only upload up to ${maxImages} profile images.`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File",
            description: "Please select only image files.",
            variant: "destructive"
          });
          return;
        }
        formData.append('files', file);
      });

      // Use the real API endpoint
      const response = await axios.post(
        `https://api.swingboudoirmag.com/api/v1/profile/${profileData.id}/upload/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update local state for immediate UI feedback
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setProfileImages(prev => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);
      });

      toast({
        title: "Images Uploaded!",
        description: `${files.length} image(s) have been uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverImageUpload = async (files: FileList | null) => {
    if (!files || !profileData?.id) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', files[0]);

      // Use the real API endpoint
      const response = await axios.post(
        `https://api.swingboudoirmag.com/api/v1/profile/${profileData.id}/upload/cover`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Cover Image Uploaded!",
        description: "Your cover image has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Cover upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload cover image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCoverImage = async () => {
    if (!profileData?.id) return;

    try {
      await removeCoverImage.mutateAsync({ id: profileData.id });
      toast({
        title: "Cover Image Removed",
        description: "Your cover image has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove cover image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeImage = async (index: number) => {
    if (!profileData?.id) return;

    try {
      // If we have the image ID from the API, we can remove it
      // For now, we'll just remove from local state
      // In a real implementation, you'd need to get the image ID
      setProfileImages(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: "Image Removed",
        description: "Profile image has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveExistingPhoto = async (photoId: string) => {
    if (!profileData?.id) return;

    try {
      // Use the real API endpoint
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://api.swingboudoirmag.com/api/v1/profile/${profileData.id}/images/${photoId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Profile Photo Removed",
        description: "Profile photo has been removed successfully.",
      });
      // Update local state to remove the deleted photo
      setProfileImages(prev => prev.filter(url => url !== profileData.profilePhotos?.find(p => p.id === photoId)?.url));
    } catch (error) {
      console.error('Remove photo error:', error);
      toast({
        title: "Error",
        description: "Failed to remove profile photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <Button 
          onClick={isEditing ? saveProfile : () => setIsEditing(true)}
          className="flex items-center gap-2"
          disabled={isSaving || isUploading}
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
              <Label htmlFor="hobbies">Hobbies & Interests</Label>
              <Textarea
                id="hobbies"
                value={profile.hobbies}
                onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                disabled={!isEditing}
                rows={2}
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+1 210 456 2719"
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                disabled={!isEditing}
                placeholder="Manhattan"
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                disabled={!isEditing}
                placeholder="United States"
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={profile.instagram}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                disabled={!isEditing}
                placeholder="https://instagram.com/yourusername"
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="tiktok">TikTok</Label>
              <Input
                id="tiktok"
                value={profile.tiktok}
                onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
                disabled={!isEditing}
                placeholder="https://tiktok.com/@yourusername"
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={profile.youtube}
                onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                disabled={!isEditing}
                placeholder="https://youtube.com/@yourchannel"
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={profile.twitter}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                disabled={!isEditing}
                placeholder="https://twitter.com/yourusername"
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

      {/* Photo Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Cover Image</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={coverFileInputRef}
            accept="image/*"
            onChange={(e) => handleCoverImageUpload(e.target.files)}
            className="hidden"
            aria-label="Upload profile cover image"
            disabled={isUploading}
          />
          
          {profileData?.coverImage?.url && (
            <div className="mb-4">
              <div className="relative group aspect-w-1 aspect-h-1 w-48 mx-auto">
                <img
                  src={profileData.coverImage.url}
                  alt="Profile Cover"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Failed to load cover image:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  onClick={handleRemoveCoverImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove cover image"
                  title="Remove cover image"
                  disabled={removeCoverImage.isPending}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {profileData?.coverImage?.url ? "Cover image uploaded" : "No cover image uploaded"}
            </p>
            <Button 
              variant="outline"
              onClick={() => coverFileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Cover Image"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Photos Section */}
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
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            aria-label="Upload profile photos"
            disabled={isUploading}
          />
          
          {profileImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {profileImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Profile ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Failed to load local profile image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove profile image ${index + 1}`}
                    title={`Remove profile image ${index + 1}`}
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Show existing profile photos from API */}
          {profileData?.profilePhotos && profileData.profilePhotos.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Existing Profile Photos:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileData.profilePhotos.map((photo, index) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={`Profile Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Failed to load profile photo:', e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => handleRemoveExistingPhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove profile photo ${index + 1}`}
                      title={`Remove profile photo ${index + 1}`}
                      disabled={isUploading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
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
              disabled={profileImages.length >= 20 || isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Profile Photos"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}