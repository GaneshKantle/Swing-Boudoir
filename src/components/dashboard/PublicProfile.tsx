import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useCompetitions } from '@/hooks/useCompetitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Share2, 
  Trophy, 
  Users, 
  Calendar, 
  Camera,
  Edit,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function PublicProfile() {
  const { user } = useAuth();
  const { useProfileByUserId } = useProfile();
  const { getActiveCompetitions } = useCompetitions();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'competitions' | 'portfolio'>('overview');

  // Get profile data
  const { data: profile, isLoading, error } = useProfileByUserId(user?.id || '');
  const activeCompetitions = getActiveCompetitions();

  const handleEditProfile = () => {
    navigate('/dashboard/edit-profile');
  };

  const handlePublicPage = () => {
    // Navigate to public profile page that can be shared
    const publicUrl = `${window.location.origin}/profile/${user?.username || user?.id}`;
    window.open(publicUrl, '_blank');
  };

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.username || user?.id}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
            <p className="text-gray-600 mb-4">Please complete your profile setup first.</p>
            <Button onClick={handleEditProfile}>
              <Edit className="w-4 h-4 mr-2" />
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePublicPage}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Public Page
          </Button>
          <Button variant="outline" onClick={shareProfile}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleEditProfile}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatarUrl || undefined} />
              <AvatarFallback className="text-xl">
                {profile?.bio?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile?.bio || 'Your Name'}</h2>
              <p className="text-gray-600">{profile?.bio || 'Tell us about yourself...'}</p>
              {profile?.hobbiesAndPassions && (
                <p className="text-sm text-gray-500 mt-1">{profile?.hobbiesAndPassions}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">15</div>
            <div className="text-sm text-gray-600">Ranking</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Active Contests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">$1,250</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">892</div>
            <div className="text-sm text-gray-600">Total Votes</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          className="flex-1"
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'competitions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('competitions')}
          className="flex-1"
        >
          Competitions
        </Button>
        <Button
          variant={activeTab === 'portfolio' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('portfolio')}
          className="flex-1"
        >
          Portfolio
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900">{profile?.createdAt ? new Date(profile?.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-gray-900">{profile?.updatedAt ? new Date(profile?.updatedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            
            {profile?.hobbiesAndPassions && (
              <div>
                <label className="text-sm font-medium text-gray-700">Hobbies & Interests</label>
                <p className="text-gray-900">{profile?.hobbiesAndPassions}</p>
              </div>
            )}

            {profile?.paidVoterMessage && (
              <div>
                <label className="text-sm font-medium text-gray-700">Message for Premium Voters</label>
                <p className="text-gray-900">{profile?.paidVoterMessage}</p>
              </div>
            )}

            {profile?.freeVoterMessage && (
              <div>
                <label className="text-sm font-medium text-gray-700">Message for Free Voters</label>
                <p className="text-gray-900">{profile?.freeVoterMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'competitions' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            {activeCompetitions && activeCompetitions.length > 0 ? (
              <div className="space-y-4">
                {activeCompetitions.map((contest) => (
                  <div key={contest.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{contest.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(contest.startDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Ends: {new Date(contest.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">${contest.prizePool.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Prize Pool</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Competitions Yet</h3>
                <p className="text-gray-600 mb-4">Join your first competition to start building your profile!</p>
                <Button onClick={() => navigate('/dashboard/competitions')}>
                  Browse Competitions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'portfolio' && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Photos</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.profilePhotos && profile?.profilePhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile?.profilePhotos.map((photo, index) => (
                  <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border">
                    <img 
                      src={photo.url} 
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Portfolio Photos</h3>
                <p className="text-gray-600 mb-4">Upload photos to showcase your work!</p>
                <Button onClick={handleEditProfile}>
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}