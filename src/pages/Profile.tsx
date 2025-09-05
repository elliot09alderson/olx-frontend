import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AdCard } from '@/components/AdCard';
import { Edit, Mail, Calendar, MapPin, Star, Plus, Grid, List } from 'lucide-react';
import { adService } from '../utils/adService';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [myAds, setMyAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'ads' && user) {
      fetchMyAds();
    }
  }, [activeTab, user]);

  const fetchMyAds = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adService.getUserAds();
      
      if (response.success) {
        setMyAds(response.data.ads || []);
      } else {
        setError(response.message || 'Failed to fetch your ads');
      }
    } catch (err) {
      console.error('Error fetching user ads:', err);
      setError('Failed to fetch your ads');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAd = (ad) => {
    navigate(`/edit-ad/${ad._id}`);
  };

  const handleDeleteAd = async (adId) => {
    try {
      const response = await adService.deleteAd(adId);
      if (response.success) {
        setMyAds(prev => prev.filter(ad => ad._id !== adId));
      } else {
        alert(response.message || 'Failed to delete ad');
      }
    } catch (err) {
      console.error('Error deleting ad:', err);
      alert('Failed to delete ad');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-24">
        <Card className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            Please login to view your profile.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.fullname} />
                    <AvatarFallback className="text-2xl">
                      {user.fullname?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-2xl font-bold">{user.fullname}</h1>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{user.role === 'admin' ? 'Admin' : 'User'}</Badge>
                      {user.role === 'admin' && (
                        <Badge variant="outline">Verified</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="glass-button">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{myAds.length}</div>
                  <div className="text-sm text-muted-foreground">My Ads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{myAds.filter(ad => ad.status === 'sold').length}</div>
                  <div className="text-sm text-muted-foreground">Sold Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{myAds.reduce((sum, ad) => sum + ad.views, 0)}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Tabs */}
          <div className="flex gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-lg">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              className="flex-1"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'ads' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('ads')}
              className="flex-1"
            >
              My Ads ({myAds.length})
            </Button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' ? (
            <>
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card hover-lift cursor-pointer" onClick={() => navigate('/upload-ad')}>
                  <CardContent className="p-4 text-center">
                    <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-sm font-medium">Post New Ad</div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card hover-lift cursor-pointer" onClick={() => setActiveTab('ads')}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">{myAds.length}</div>
                    <div className="text-sm font-medium">My Ads</div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card hover-lift cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">--</div>
                    <div className="text-sm font-medium">Favorites</div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card hover-lift cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-2">--</div>
                    <div className="text-sm font-medium">Messages</div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            /* My Ads Tab */
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Ads</h2>
                <Button onClick={() => navigate('/upload-ad')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Ad
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <Card className="glass-card mb-6 border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-red-600">{error}</p>
                    <Button 
                      variant="outline" 
                      onClick={fetchMyAds}
                      className="mt-2"
                      size="sm"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="glass-card animate-pulse">
                      <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* My Ads Grid */}
              {!loading && !error && (
                <>
                  {myAds.length === 0 ? (
                    <Card className="glass-card">
                      <CardContent className="p-12 text-center">
                        <h3 className="text-xl font-semibold mb-2">No ads yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Start selling by posting your first ad
                        </p>
                        <Button onClick={() => navigate('/upload-ad')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Post Your First Ad
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myAds.map((ad) => (
                        <AdCard
                          key={ad._id}
                          ad={ad}
                          showActions={true}
                          onEdit={handleEditAd}
                          onDelete={handleDeleteAd}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};