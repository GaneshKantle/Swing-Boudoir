import React, { useState, useRef } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, X, Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfileSetupStep: React.FC = () => {
  const { user } = useAuth();
  const { onboardingData, updateOnboardingData, nextStep, completeStep } = useOnboarding();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioFileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('https://api.swingboudoirmag.com/api/v1/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        updateOnboardingData({ profilePhoto: data.url });
        toast({
          title: "Photo uploaded!",
          description: "Your profile photo has been updated."
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again with a different image.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePortfolioUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploadingPortfolio(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://api.swingboudoirmag.com/api/v1/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          return data.url;
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const currentPhotos = onboardingData.portfolioPhotos || [];
      const newPhotos = [...currentPhotos, ...uploadedUrls];
      
      // Limit to 20 photos
      const limitedPhotos = newPhotos.slice(0, 20);
      
      updateOnboardingData({ portfolioPhotos: limitedPhotos });
      
      toast({
        title: "Photos uploaded!",
        description: `${uploadedUrls.length} photos have been added to your portfolio.`
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again with different images.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingPortfolio(false);
    }
  };

  const removePortfolioPhoto = (index: number) => {
    const currentPhotos = onboardingData.portfolioPhotos || [];
    const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
    updateOnboardingData({ portfolioPhotos: updatedPhotos });
  };

  const handleContinue = () => {
    if (!onboardingData.basicInfo.name || !onboardingData.basicInfo.bio) {
      toast({
        title: "Please complete required fields",
        description: "Name and bio are required to continue.",
        variant: "destructive"
      });
      return;
    }

    completeStep('profile-setup');
    nextStep();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Tell Us About Yourself
        </h2>
        <p className="text-gray-600 text-lg">
          Let's create your amazing profile!
        </p>
      </div>

      {/* Profile Photo */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Photo</h3>
          
          <div className="flex justify-center mb-4">
            {onboardingData.profilePhoto ? (
              <div className="relative">
                <img
                  src={onboardingData.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  onClick={() => updateOnboardingData({ profilePhoto: undefined })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  aria-label="Remove profile photo"
                  title="Remove profile photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e.target.files)}
            className="hidden"
            aria-label="Upload profile photo"
            title="Upload profile photo"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            disabled={isUploading}
            className="px-6 py-3"
          >
            <Upload className="mr-2 h-5 w-5" />
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 text-center">Basic Information</h3>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Your Name *
            </Label>
            <Input
              id="name"
              value={onboardingData.basicInfo.name}
              onChange={(e) => updateOnboardingData({
                basicInfo: { ...onboardingData.basicInfo, name: e.target.value }
              })}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Tell us about yourself *
            </Label>
            <Textarea
              id="bio"
              value={onboardingData.basicInfo.bio}
              onChange={(e) => updateOnboardingData({
                basicInfo: { ...onboardingData.basicInfo, bio: e.target.value }
              })}
              placeholder="Share a bit about yourself, your interests, and what makes you unique..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="hobbies" className="text-sm font-medium text-gray-700">
              Hobbies & Interests
            </Label>
            <Textarea
              id="hobbies"
              value={onboardingData.basicInfo.hobbies || ''}
              onChange={(e) => updateOnboardingData({
                basicInfo: { ...onboardingData.basicInfo, hobbies: e.target.value }
              })}
              placeholder="What do you love to do? (e.g., photography, fitness, travel, art...)"
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">
              Your Age
            </Label>
            <Input
              id="age"
              type="number"
              value={onboardingData.basicInfo.age}
              onChange={(e) => updateOnboardingData({
                basicInfo: { ...onboardingData.basicInfo, age: e.target.value }
              })}
              placeholder="Your age"
              min="18"
              max="100"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Where are you from?
            </Label>
            <Input
              id="location"
              value={onboardingData.basicInfo.location}
              onChange={(e) => updateOnboardingData({
                basicInfo: { ...onboardingData.basicInfo, location: e.target.value }
              })}
              placeholder="City, Country"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Messages for Voters */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 text-center">Messages for Voters</h3>
        
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <Label htmlFor="paid-message" className="text-sm font-medium text-gray-700 flex items-center">
              <Heart className="mr-2 h-4 w-4 text-pink-500" />
              Message for Paid Voters
            </Label>
            <Textarea
              id="paid-message"
              value={onboardingData.basicInfo.paidVoterMessage || ''}
              onChange={(e) => updateOnboardingData({
                basicInfo: { ...onboardingData.basicInfo, paidVoterMessage: e.target.value }
              })}
              placeholder="Thank you for your support! Your votes mean the world to me..."
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be shown to people who purchase votes for you
            </p>
          </div>

          <div>
            <Label htmlFor="free-message" className="text-sm font-medium text-gray-700 flex items-center">
              <MessageCircle className="mr-2 h-4 w-4 text-blue-500" />
              Message for Free Voters
            </Label>
            <Textarea
              id="free-message"
              value={onboardingData.basicInfo.freeVoterMessage || ''}
              onChange={(e) => updateOnboardingData({
                basicInfo: { ...onboardingData.basicInfo, freeVoterMessage: e.target.value }
              })}
              placeholder="Thank you for voting! Every vote counts and I appreciate your support..."
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This message will be shown to people who vote for you for free
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Photos */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Photos (Up to 20)</h3>
          <p className="text-gray-600 text-sm mb-4">
            Upload your best photos to showcase your talent
          </p>
          
          <input
            type="file"
            ref={portfolioFileInputRef}
            accept="image/*"
            multiple
            onChange={(e) => handlePortfolioUpload(e.target.files)}
            className="hidden"
            aria-label="Upload portfolio photos"
            title="Upload portfolio photos"
          />
          
          <Button
            onClick={() => portfolioFileInputRef.current?.click()}
            variant="outline"
            disabled={isUploadingPortfolio || (onboardingData.portfolioPhotos?.length || 0) >= 20}
            className="px-6 py-3"
          >
            <Upload className="mr-2 h-5 w-5" />
            {isUploadingPortfolio ? 'Uploading...' : 'Upload Photos'}
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            {(onboardingData.portfolioPhotos?.length || 0)}/20 photos uploaded
          </p>
        </div>

        {/* Portfolio Grid */}
        {onboardingData.portfolioPhotos && onboardingData.portfolioPhotos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {onboardingData.portfolioPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePortfolioPhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                  title="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="text-center pt-6">
        <Button
          onClick={handleContinue}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}; 