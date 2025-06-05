
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

export const JobFilters = () => {
  const [activeFilters, setActiveFilters] = useState([]);

  const locations = [
    "Victoria", "Vancouver", "Burnaby", "Surrey", "Richmond", 
    "Langford", "Saanich", "Mill Bay", "Nanaimo"
  ];

  const jobTypes = [
    "Full-time", "Part-time", "Contract", "Temporary", "Internship"
  ];

  const experienceLevels = [
    "Entry Level", "Mid Level", "Senior Level", "Lead", "Executive"
  ];

  const addFilter = (type, value) => {
    const filterKey = `${type}:${value}`;
    if (!activeFilters.includes(filterKey)) {
      setActiveFilters([...activeFilters, filterKey]);
    }
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span className="text-xs">{filter.split(':')[1]}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveFilters([])}
              className="mt-2 text-xs"
            >
              Clear All
            </Button>
            <Separator className="mt-4" />
          </div>
        )}

        {/* Keywords Search */}
        <div>
          <Label htmlFor="keywords">Keywords</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="keywords"
              placeholder="e.g., systems analyst, developer"
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Select onValueChange={(value) => addFilter('location', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Posted */}
        <div>
          <Label htmlFor="date-posted">Date Posted</Label>
          <Select onValueChange={(value) => addFilter('date', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="3days">Last 3 days</SelectItem>
              <SelectItem value="week">Last week</SelectItem>
              <SelectItem value="month">Last month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div>
          <Label className="text-sm font-medium">Job Type</Label>
          <div className="mt-2 space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox 
                  id={type}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addFilter('type', type);
                    } else {
                      removeFilter(`type:${type}`);
                    }
                  }}
                />
                <Label htmlFor={type} className="text-sm font-normal">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <Label className="text-sm font-medium">Experience Level</Label>
          <div className="mt-2 space-y-2">
            {experienceLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox 
                  id={level}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addFilter('experience', level);
                    } else {
                      removeFilter(`experience:${level}`);
                    }
                  }}
                />
                <Label htmlFor={level} className="text-sm font-normal">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full mt-6">Apply Filters</Button>
      </CardContent>
    </Card>
  );
};
