import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  'Electronics',
  'Vehicles',
  'Home & Furniture',
  'Fashion',
  'Books, Sports & Hobbies',
  'Jobs',
  'Services',
  'Real Estate',
  'Pets',
  'Other'
];

export const CategoryFilter = React.memo(({ value, onChange, isOpen, onOpenChange }: CategoryFilterProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
          <h3 className="font-medium">Category</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-3">
        <Select value={value} onValueChange={onChange}>
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
  );
});

CategoryFilter.displayName = 'CategoryFilter';