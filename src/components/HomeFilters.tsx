import React, { useState, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { CategoryFilter } from './filters/CategoryFilter';
import { ConditionFilter } from './filters/ConditionFilter';
import { PriceFilter } from './filters/PriceFilter';
import { LocationFilter } from './filters/LocationFilter';
import { ActiveFilters } from './filters/ActiveFilters';

interface HomeFiltersProps {
  filters: {
    category: string;
    condition: string;
    city: string;
    state: string;
    minPrice: string;
    maxPrice: string;
    query: string;
  };
  updateFilters: (filters: any) => void;
  clearFilters: () => void;
  adsCount: number;
}

const HomeFiltersComponent: React.FC<HomeFiltersProps> = ({ 
  filters, 
  updateFilters, 
  clearFilters, 
  adsCount 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [conditionOpen, setConditionOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);
  
  // Local state for search query to prevent refreshing while typing
  const [localQuery, setLocalQuery] = useState(filters.query);

  // Direct price range update without throttling
  const handlePriceRangeChange = useCallback((values: number[]) => {
    if (Array.isArray(values) && values.length === 2) {
      const MIN_PRICE = 0;
      const MAX_PRICE = 500000;
      
      // Only update if values are different to prevent feedback loops
      const newMinPrice = values[0] > MIN_PRICE ? Math.round(values[0]).toString() : '';
      const newMaxPrice = values[1] < MAX_PRICE ? Math.round(values[1]).toString() : '';
      
      if (newMinPrice !== filters.minPrice || newMaxPrice !== filters.maxPrice) {
        updateFilters({
          minPrice: newMinPrice,
          maxPrice: newMaxPrice
        });
      }
    }
  }, [updateFilters, filters.minPrice, filters.maxPrice]);

  const handlePriceChange = useCallback((field: 'minPrice' | 'maxPrice', value: string) => {
    updateFilters({ [field]: value });
  }, [updateFilters]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalQuery(value);
    updateFilters({ query: value });
  }, [updateFilters]);

  const handleClearFilter = useCallback((field: string, value: string) => {
    updateFilters({ [field]: value });
  }, [updateFilters]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.condition && filters.condition !== 'all') count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.query) count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="font-medium">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search ads..."
          value={localQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="glass-button"
        />
      </div>

      {/* Active Filters */}
      <ActiveFilters 
        filters={filters} 
        onClearAll={clearFilters} 
        onClearFilter={handleClearFilter}
      />

      {/* Category Filter */}
      <CategoryFilter
        value={filters.category}
        onChange={(value) => updateFilters({ category: value })}
        isOpen={categoryOpen}
        onOpenChange={setCategoryOpen}
      />

      {/* Condition Filter */}
      <ConditionFilter
        value={filters.condition}
        onChange={(value) => updateFilters({ condition: value })}
        isOpen={conditionOpen}
        onOpenChange={setConditionOpen}
      />

      {/* Price Filter */}
      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={handlePriceChange}
        onRangeChange={handlePriceRangeChange}
        isOpen={priceOpen}
        onOpenChange={setPriceOpen}
      />

      {/* Location Filter */}
      <LocationFilter
        city={filters.city}
        state={filters.state}
        onChange={(field, value) => updateFilters({ [field]: value })}
        isOpen={locationOpen}
        onOpenChange={setLocationOpen}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-80 space-y-6">
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Badge variant="outline">{adsCount} results</Badge>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="glass-button flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 glass-card">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                {adsCount} results found
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export const HomeFilters = React.memo(HomeFiltersComponent);