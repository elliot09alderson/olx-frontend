import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Grid, List, SlidersHorizontal, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdCard } from '@/components/AdCard';
import { HomeFilters } from '@/components/HomeFilters';
import { LoadingGrid } from '@/components/LoadingCard';
import { adService } from '../utils/adService';
import { useDebounce } from '../hooks/useDebounce';
import { useThrottle } from '../hooks/useThrottle';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'featured';

export const Home = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPriceFiltering, setIsPriceFiltering] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    condition: 'all',
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    query: ''
  });

  // Keep debouncing only for search queries to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(filters.query, 500);

  const fetchAds = async (skipLoadingState = false) => {
    try {
      if (!skipLoadingState) {
        setLoading(true);
      }
      setError('');
      
      const sortField = sortBy === 'newest' ? 'createdAt' : 
                       sortBy === 'oldest' ? 'createdAt' : 
                       sortBy === 'price-low' || sortBy === 'price-high' ? 'price' : 'createdAt';
      
      const sortOrder = sortBy === 'oldest' || sortBy === 'price-low' ? 'asc' : 'desc';
      
      // Build params with filters using debounced values where appropriate
      const params = {
        sortBy: sortField,
        sortOrder,
        page: 1,
        limit: 20,
        ...(debouncedSearchQuery && { query: debouncedSearchQuery }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.condition && filters.condition !== 'all' && { condition: filters.condition }),
        ...(filters.city && { city: filters.city }),
        ...(filters.state && { state: filters.state }),
        ...(filters.minPrice && !isNaN(parseFloat(filters.minPrice)) && { minPrice: parseFloat(filters.minPrice) }),
        ...(filters.maxPrice && !isNaN(parseFloat(filters.maxPrice)) && { maxPrice: parseFloat(filters.maxPrice) })
      };

      console.log('Fetching ads with params:', params);
      const response = await adService.getAllAds(params);
      
      if (response.success) {
        setAds(response.data.ads || []);
      } else {
        setError(response.message || 'Failed to fetch ads');
        setAds([]);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to fetch ads');
      setAds([]);
    } finally {
      if (!skipLoadingState) {
        setLoading(false);
      }
      setIsSearching(false);
      setIsPriceFiltering(false);
    }
  };

  // Main filters effect
  useEffect(() => {
    if (!loading) {
      setIsSearching(true);
    }
    fetchAds();
  }, [
    sortBy, 
    filters.category, 
    filters.condition, 
    filters.city, 
    filters.state,
    filters.minPrice,
    filters.maxPrice,
    debouncedSearchQuery
  ]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      condition: 'all',
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      query: ''
    });
  }, []);


  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'featured': return 'Featured First';
      default: return 'Newest First';
    }
  };

  // Show loading only for main content, not filters
  if (loading && ads.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Render filters without skeleton */}
            <HomeFilters filters={filters} updateFilters={updateFilters} clearFilters={clearFilters} adsCount={0} />
            <div className="flex-1">
              <LoadingGrid />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop/Tablet Only */}
          <HomeFilters filters={filters} updateFilters={updateFilters} clearFilters={clearFilters} adsCount={ads.length} />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="glass-card p-4 rounded-lg mb-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    All Ads ({ads.length})
                    {isPriceFiltering && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </h1>
                  
                  {/* Desktop View Mode Toggle */}
                  <div className="hidden md:flex border border-border rounded-lg p-1 glass-button">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Mobile Filter and Sort Options */}
                <div className="flex flex-col gap-2 items-end">
                  {/* Mobile Filter Button */}
                  <div className="md:hidden w-full sm:max-w-xs">
                    <HomeFilters filters={filters} updateFilters={updateFilters} clearFilters={clearFilters} adsCount={ads.length} showMobileButton={true} />
                  </div>

                  {/* Sort Options */}
                  <div className="w-full sm:max-w-xs">
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                      <SelectTrigger className="w-full glass-button">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="featured">Featured First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="glass-card p-4 rounded-lg mb-6">
              <div className="relative">
                {isSearching && filters.query ? (
                  <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  type="text"
                  placeholder="Search for ads, products, services..."
                  value={filters.query}
                  onChange={(e) => updateFilters({ query: e.target.value })}
                  className="pl-10 glass-button text-lg h-12"
                />
                {filters.query && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilters({ query: '' })}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
              {filters.query && (
                <p className="text-sm text-muted-foreground mt-2">
                  {isSearching ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Searching for "{filters.query}"...
                    </span>
                  ) : (
                    `Searching for "${filters.query}" in ${ads.length} results`
                  )}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-card p-6 rounded-lg mb-6 border-red-200 bg-red-50">
                <p className="text-red-600">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={fetchAds}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Results */}
            {!error && ads.length === 0 && !loading ? (
              <div className="glass-card p-12 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">No ads found</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to post an ad!
                </p>
                <Button variant="outline">Post Your Ad</Button>
              </div>
            ) : !error && ads.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {ads.map((ad) => (
                  <AdCard
                    key={ad._id}
                    ad={ad}
                    showWishlistButton={true}
                  />
                ))}
              </div>
            ) : null}

            {/* Load More (for future pagination) */}
            {ads.length >= 20 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="glass-button">
                  Load More Ads
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};