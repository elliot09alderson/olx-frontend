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

interface LocationFilterProps {
  city: string;
  state: string;
  onChange: (field: 'city' | 'state', value: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LocationFilter = React.memo(({ 
  city, 
  state, 
  onChange, 
  isOpen, 
  onOpenChange 
}: LocationFilterProps) => {
  const [localCity, setLocalCity] = useState(city);
  const [localState, setLocalState] = useState(state);

  // Sync local state with props
  useEffect(() => {
    setLocalCity(city);
    setLocalState(state);
  }, [city, state]);

  const handleCityChange = useCallback((value: string) => {
    setLocalCity(value);
    onChange('city', value);
  }, [onChange]);

  const handleStateChange = useCallback((value: string) => {
    setLocalState(value);
    onChange('state', value);
  }, [onChange]);

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
          <h3 className="font-medium">Location</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 mt-3">
        <div className="space-y-2">
          <div>
            <Label htmlFor="city" className="text-sm">City</Label>
            <Input
              id="city"
              type="text"
              placeholder="Enter city"
              value={localCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="glass-button"
            />
          </div>
          <div>
            <Label htmlFor="state" className="text-sm">State</Label>
            <Input
              id="state"
              type="text"
              placeholder="Enter state"
              value={localState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="glass-button"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

LocationFilter.displayName = 'LocationFilter';