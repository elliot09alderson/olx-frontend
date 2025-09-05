import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActiveFiltersProps {
  filters: {
    category: string;
    condition: string;
    city: string;
    state: string;
    minPrice: string;
    maxPrice: string;
    query: string;
  };
  onClearAll: () => void;
  onClearFilter: (field: string, value?: string) => void;
}

export const ActiveFilters = React.memo(({ filters, onClearAll, onClearFilter }: ActiveFiltersProps) => {
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

  if (getActiveFiltersCount() === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Active Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.category && filters.category !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {filters.category}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onClearFilter('category', 'all')}
            />
          </Badge>
        )}
        {filters.condition && filters.condition !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {filters.condition}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onClearFilter('condition', 'all')}
            />
          </Badge>
        )}
        {filters.minPrice && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Min: ₹{filters.minPrice}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onClearFilter('minPrice', '')}
            />
          </Badge>
        )}
        {filters.maxPrice && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Max: ₹{filters.maxPrice}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onClearFilter('maxPrice', '')}
            />
          </Badge>
        )}
        {filters.city && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {filters.city}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onClearFilter('city', '')}
            />
          </Badge>
        )}
        {filters.state && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {filters.state}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onClearFilter('state', '')}
            />
          </Badge>
        )}
      </div>
    </div>
  );
});

ActiveFilters.displayName = 'ActiveFilters';