import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onChange: (field: 'minPrice' | 'maxPrice', value: string) => void;
  onRangeChange: (values: number[]) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MIN_PRICE = 0;
const MAX_PRICE = 500000;

export const PriceFilter = React.memo(({ 
  minPrice, 
  maxPrice, 
  onChange, 
  onRangeChange,
  isOpen, 
  onOpenChange 
}: PriceFilterProps) => {
  const [priceRange, setPriceRange] = useState([
    minPrice ? parseFloat(minPrice) : MIN_PRICE,
    maxPrice ? parseFloat(maxPrice) : MAX_PRICE
  ]);
  
  // Local input states to prevent cursor jumping
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [isSliderActive, setIsSliderActive] = useState(false);

  // Only update local slider state when props change and slider is not being dragged
  useEffect(() => {
    if (!isSliderActive) {
      const newRange = [
        minPrice ? parseFloat(minPrice) : MIN_PRICE,
        maxPrice ? parseFloat(maxPrice) : MAX_PRICE
      ];
      setPriceRange(newRange);
    }
  }, [minPrice, maxPrice, isSliderActive]);

  // Update local input states when props change
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  // Handle visual updates during dragging (no API calls)
  const handleRangeChange = useCallback((values: number[]) => {
    setPriceRange(values);
    setIsSliderActive(true);
  }, []);

  // Handle API updates when dragging ends
  const handleRangeCommit = useCallback((values: number[]) => {
    setPriceRange(values);
    setIsSliderActive(false);
    // Only call API when user finishes dragging
    onRangeChange(values);
  }, [onRangeChange]);

  const handleInputChange = useCallback((field: 'minPrice' | 'maxPrice', value: string) => {
    // Update local state immediately for smooth typing
    if (field === 'minPrice') {
      setLocalMinPrice(value);
    } else {
      setLocalMaxPrice(value);
    }
    
    // Update parent state
    onChange(field, value);
    
    // Only update slider if value is a valid number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (field === 'minPrice') {
        setPriceRange([numValue, priceRange[1]]);
      } else {
        setPriceRange([priceRange[0], numValue]);
      }
    }
  }, [onChange, priceRange]);

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
          <h3 className="font-medium">Price Range</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-3">
        {/* Price Range Slider */}
        <div className="px-2">
          <DualRangeSlider
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={100}
            value={priceRange}
            onValueChange={handleRangeChange}
            onValueCommit={handleRangeCommit}
            className="w-full"
            labelPosition="bottom"
          />
        </div>
        
        {/* Manual Price Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="priceMin" className="text-sm">Min Price</Label>
            <Input
              id="priceMin"
              type="number"
              placeholder="₹0"
              value={localMinPrice}
              onChange={(e) => handleInputChange('minPrice', e.target.value)}
              className="glass-button"
            />
          </div>
          <div>
            <Label htmlFor="priceMax" className="text-sm">Max Price</Label>
            <Input
              id="priceMax"
              type="number"
              placeholder="₹5,00,000"
              value={localMaxPrice}
              onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              className="glass-button"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

PriceFilter.displayName = 'PriceFilter';