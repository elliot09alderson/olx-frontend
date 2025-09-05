import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Eye, Heart } from 'lucide-react';
import { wishlistService } from '../utils/wishlistService';
import { useAuth } from '../contexts/AuthContext';

interface Ad {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  slug: string;
  views: number;
  status: string;
  createdAt: string;
  user?: {
    _id: string;
    fullname: string;
    email: string;
  };
}

interface AdCardProps {
  ad: Ad;
  showActions?: boolean;
  showWishlistButton?: boolean;
  onEdit?: (ad: Ad) => void;
  onDelete?: (adId: string) => void;
  onWishlistToggle?: (adId: string, isInWishlist: boolean) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ 
  ad, 
  showActions = false,
  showWishlistButton = true,
  onEdit, 
  onDelete,
  onWishlistToggle
}) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Check if ad is in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && ad._id && !showActions) { // Don't show wishlist for user's own ads
        const result = await wishlistService.isInWishlist(ad._id);
        if (result.success) {
          setIsInWishlist(result.data.data.isInWishlist);
        }
      }
    };

    checkWishlistStatus();
  }, [user, ad._id, showActions]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Like New':
        return 'bg-blue-100 text-blue-800';
      case 'Good':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fair':
        return 'bg-orange-100 text-orange-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit && onEdit(ad);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ad?')) {
      onDelete && onDelete(ad._id);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    setIsWishlistLoading(true);
    
    const result = await wishlistService.toggleWishlist(ad._id, isInWishlist);
    
    if (result.success) {
      const newWishlistStatus = !isInWishlist;
      setIsInWishlist(newWishlistStatus);
      onWishlistToggle && onWishlistToggle(ad._id, newWishlistStatus);
    } else {
      alert(result.message || 'Failed to update wishlist');
    }
    
    setIsWishlistLoading(false);
  };

  return (
    <Link 
      to={`/ad/${ad.slug}`}
      className="block glass-card rounded-lg hover:shadow-lg transition-all duration-200 hover-lift"
    >
      <div className="relative">
        {/* Image */}
        <div className="aspect-w-16 aspect-h-12 bg-muted rounded-t-lg overflow-hidden">
          {ad.images && ad.images.length > 0 ? (
            <img
              src={ad.images[0].url}
              alt={ad.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Status and Actions */}
        <div className="absolute top-2 right-2 flex gap-2">
          {ad.status === 'sold' && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              SOLD
            </span>
          )}
          
          {/* Wishlist Button - Show for all users except on their own ads */}
          {user && showWishlistButton && !showActions && (
            <button
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              className={`p-2 rounded-full transition-all duration-300 backdrop-blur-md border shadow-lg ${
                isInWishlist 
                  ? 'bg-red-500/80 text-white border-red-400/50 hover:bg-red-500/90 hover:shadow-red-500/25' 
                  : 'bg-white/80 text-red-500 border-white/50 hover:bg-red-50/80 hover:shadow-red-500/20'
              } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                className={`h-4 w-4 transition-all duration-300 ${
                  isInWishlist ? 'fill-current scale-110 drop-shadow-sm' : 'hover:scale-110'
                } ${isWishlistLoading ? 'animate-pulse' : ''}`} 
              />
            </button>
          )}
          
          {showActions && (
            <div className="flex gap-1">
              <button
                onClick={handleEdit}
                className="p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/80 transition-colors glass-button"
                title="Edit ad"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80 transition-colors glass-button"
                title="Delete ad"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price and Date */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(ad.price)}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatDate(ad.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {ad.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {ad.description}
        </p>

        {/* Category and Condition */}
        <div className="flex gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
            {ad.category}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(ad.condition)}`}>
            {ad.condition}
          </span>
        </div>

        {/* Location and Views */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>
            {ad.location.city}, {ad.location.state}
          </span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{ad.views} views</span>
          </div>
        </div>

        {/* Seller Info (if available and not showing actions) */}
        {!showActions && ad.user && (
          <div className="mt-2 pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Seller: {ad.user.fullname}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};