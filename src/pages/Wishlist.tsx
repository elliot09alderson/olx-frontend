import React, { useState, useEffect } from 'react';
import { Heart, Loader2, ShoppingBag } from 'lucide-react';
import { AdCard } from '@/components/AdCard';
import { Button } from '@/components/ui/button';
import { wishlistService } from '../utils/wishlistService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Wishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchWishlist = async (pageNumber = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      setError('');
      
      const result = await wishlistService.getUserWishlist({
        page: pageNumber,
        limit: 20
      });

      if (result.success) {
        const newItems = result.data.data.wishlistItems.map(item => item.ad);
        
        if (append) {
          setWishlistItems(prev => [...prev, ...newItems]);
        } else {
          setWishlistItems(newItems);
        }
        
        setTotalPages(result.data.data.pagination.pages);
        setPage(pageNumber);
      } else {
        setError(result.message || 'Failed to fetch wishlist');
      }
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleWishlistToggle = async (adId: string, isInWishlist: boolean) => {
    // Remove from local state immediately for better UX
    if (!isInWishlist) {
      setWishlistItems(prev => prev.filter(item => item._id !== adId));
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchWishlist(page + 1, true);
    }
  };

  // Show login message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-6">
              Please login to view your wishlist
            </p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading wishlist...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="glass-card p-6 rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-2xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-card p-6 rounded-lg mb-6 border-red-200 bg-red-50">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={() => fetchWishlist()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!error && wishlistItems.length === 0 ? (
          <div className="glass-card p-12 rounded-lg text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start browsing ads and save your favorites by clicking the heart icon
            </p>
            <Link to="/">
              <Button className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Browse Ads
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {wishlistItems.map((ad) => (
                <AdCard
                  key={ad._id}
                  ad={ad}
                  showWishlistButton={true}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>

            {/* Load More Button */}
            {page < totalPages && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="glass-button"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            <div className="text-center text-sm text-muted-foreground mt-4">
              Showing page {page} of {totalPages}
            </div>
          </>
        )}
      </div>
    </div>
  );
};