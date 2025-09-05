import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  postedDate: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  featured?: boolean;
  condition?: 'new' | 'used' | 'like-new';
  views?: number;
}

interface Filters {
  category: string;
  priceMin: number | null;
  priceMax: number | null;
  location: string;
  condition: string;
  searchQuery: string;
}

interface AppContextType {
  ads: Ad[];
  filteredAds: Ad[];
  filters: Filters;
  categories: string[];
  loading: boolean;
  updateFilters: (newFilters: Partial<Filters>) => void;
  clearFilters: () => void;
  searchAds: (query: string) => void;
  getAdById: (id: string) => Ad | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data generator
const generateMockAds = (): Ad[] => {
  const categories = ['Electronics', 'Vehicles', 'Property', 'Fashion', 'Home & Garden', 'Jobs', 'Services', 'Sports'];
  const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
  const conditions = ['new', 'used', 'like-new'] as const;
  
  const mockAds: Ad[] = [];
  
  for (let i = 1; i <= 50; i++) {
    mockAds.push({
      id: i.toString(),
      title: `Sample Product ${i}`,
      description: `This is a detailed description for product ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      price: Math.floor(Math.random() * 10000) + 50,
      category: categories[Math.floor(Math.random() * categories.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      images: [
        `https://picsum.photos/800/600?random=${i}`,
        `https://picsum.photos/800/600?random=${i + 100}`,
        `https://picsum.photos/800/600?random=${i + 200}`
      ],
      postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      userId: `user_${Math.floor(Math.random() * 10) + 1}`,
      userName: `User ${Math.floor(Math.random() * 100) + 1}`,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${Math.floor(Math.random() * 100)}`,
      featured: Math.random() > 0.8,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      views: Math.floor(Math.random() * 1000) + 10
    });
  }
  
  return mockAds;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ads] = useState<Ad[]>(generateMockAds());
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    priceMin: null,
    priceMax: null,
    location: '',
    condition: 'all',
    searchQuery: ''
  });

  const categories = useMemo(() => {
    return Array.from(new Set(ads.map(ad => ad.category))).sort();
  }, [ads]);

  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      if (filters.category && filters.category !== 'all' && ad.category !== filters.category) return false;
      if (filters.priceMin !== null && ad.price < filters.priceMin) return false;
      if (filters.priceMax !== null && ad.price > filters.priceMax) return false;
      if (filters.location && !ad.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.condition && filters.condition !== 'all' && ad.condition !== filters.condition) return false;
      if (filters.searchQuery && !ad.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !ad.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      
      return true;
    });
  }, [ads, filters]);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      priceMin: null,
      priceMax: null,
      location: '',
      condition: 'all',
      searchQuery: ''
    });
  }, []);

  const searchAds = useCallback((query: string) => {
    updateFilters({ searchQuery: query });
  }, [updateFilters]);

  const getAdById = useCallback((id: string) => {
    return ads.find(ad => ad.id === id);
  }, [ads]);

  const value = {
    ads,
    filteredAds,
    filters,
    categories,
    loading,
    updateFilters,
    clearFilters,
    searchAds,
    getAdById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};