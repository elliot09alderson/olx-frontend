import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

export const Filters = () => {
  const { filters, categories, updateFilters, clearFilters, filteredAds } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [conditionOpen, setConditionOpen] = useState(true);

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'used', label: 'Used' },
  ];

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    updateFilters({ [field]: numValue });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.priceMin !== null) count++;
    if (filters.priceMax !== null) count++;
    if (filters.location) count++;
    if (filters.condition && filters.condition !== 'all') count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Active Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
              {filters.category && filters.category !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ category: 'all' })}
                  />
                </Badge>
              )}
            {filters.priceMin !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min: ${filters.priceMin}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ priceMin: null })}
                />
              </Badge>
            )}
            {filters.priceMax !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max: ${filters.priceMax}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ priceMax: null })}
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.location}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ location: '' })}
                />
              </Badge>
            )}
              {filters.condition && filters.condition !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {conditions.find(c => c.value === filters.condition)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ condition: 'all' })}
                  />
                </Badge>
              )}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
            <h3 className="font-medium">Category</h3>
            <ChevronDown className={`h-4 w-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CollapsibleContent>
      </Collapsible>

      {/* Price Filter */}
      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
            <h3 className="font-medium">Price Range</h3>
            <ChevronDown className={`h-4 w-4 transition-transform ${priceOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="priceMin" className="text-sm">Min Price</Label>
              <Input
                id="priceMin"
                type="number"
                placeholder="$0"
                value={filters.priceMin || ''}
                onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                className="glass-button"
              />
            </div>
            <div>
              <Label htmlFor="priceMax" className="text-sm">Max Price</Label>
              <Input
                id="priceMax"
                type="number"
                placeholder="$999,999"
                value={filters.priceMax || ''}
                onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                className="glass-button"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Condition Filter */}
      <Collapsible open={conditionOpen} onOpenChange={setConditionOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
            <h3 className="font-medium">Condition</h3>
            <ChevronDown className={`h-4 w-4 transition-transform ${conditionOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3">
          <Select value={filters.condition} onValueChange={(value) => updateFilters({ condition: value })}>
            <SelectTrigger className="glass-button">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CollapsibleContent>
      </Collapsible>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label htmlFor="location" className="font-medium">Location</Label>
        <Input
          id="location"
          type="text"
          placeholder="Enter city or state"
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="glass-button"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-80 space-y-6">
        <div className="glass-card p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Filters</h2>
            <Badge variant="outline">{filteredAds.length} results</Badge>
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
                {filteredAds.length} results found
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