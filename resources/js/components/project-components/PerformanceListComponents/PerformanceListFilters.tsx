import React, { useState, useEffect, useRef } from 'react';
import { Performance } from '@/data/mockPerformanceData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { CalendarDropdown } from './CalendarDropdown';
import { createPortal } from 'react-dom';

interface SearchValues {
  id: string;
  description: string;
  status: string;
  date_perfomance: string;
  date_created: string;
  unit_name: string;
}

interface PerformanceListFiltersProps {
  performances: Performance[];
  onFilteredDataChange: (data: Performance[]) => void;
}

export function PerformanceListFilters({ performances, onFilteredDataChange }: PerformanceListFiltersProps) {
  const [searchValues, setSearchValues] = useState<SearchValues>({
    id: '',
    description: '',
    status: '',
    date_perfomance: '',
    date_created: '',
    unit_name: ''
  });

  // Get unique units for the filter
  const uniqueUnits = Array.from(new Set(performances.map(p => p.unit_name || ''))).filter(Boolean) as string[];
  const [unitFilter, setUnitFilter] = useState<string>('all');

  const [showPerformanceDateCalendar, setShowPerformanceDateCalendar] = useState(false);
  const [showCreatedDateCalendar, setShowCreatedDateCalendar] = useState(false);
  const performanceInputRef = useRef<HTMLInputElement>(null);
  const createdInputRef = useRef<HTMLInputElement>(null);
  const [performanceCalPos, setPerformanceCalPos] = useState<{top:number,left:number}>({top:0,left:0});
  const [createdCalPos, setCreatedCalPos] = useState<{top:number,left:number}>({top:0,left:0});

  useEffect(() => {
    let filtered = [...performances];

    // Apply ID filter
    if (searchValues.id) {
      filtered = filtered.filter(performance => 
        performance.id.toString().includes(searchValues.id)
      );
    }

    // Apply description filter
    if (searchValues.description) {
      filtered = filtered.filter(performance => 
        performance.description.toLowerCase().includes(searchValues.description.toLowerCase())
      );
    }

    // Apply status filter
    if (searchValues.status && searchValues.status !== 'all') {
      filtered = filtered.filter(performance => 
        performance.status === searchValues.status
      );
    }

    // Apply performance date filter
    if (searchValues.date_perfomance) {
      filtered = filtered.filter(performance => 
        performance.date_perfomance === searchValues.date_perfomance
      );
    }

    // Apply created date filter
    if (searchValues.date_created) {
      filtered = filtered.filter(performance => 
        performance.date_created?.includes(searchValues.date_created)
      );
    }

    // Apply unit name filter
    if (searchValues.unit_name) {
      filtered = filtered.filter(performance => 
        performance.unit_name?.toLowerCase().includes(searchValues.unit_name.toLowerCase())
      );
    }

    // Apply unit filter
    if (unitFilter !== 'all') {
      filtered = filtered.filter(performance => performance.unit_name === unitFilter);
    }

    onFilteredDataChange(filtered);
  }, [searchValues, unitFilter, performances, onFilteredDataChange]);

  const handleChange = (field: keyof SearchValues, value: string) => {
    setSearchValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchValues({
      id: '',
      description: '',
      status: '',
      date_perfomance: '',
      date_created: '',
      unit_name: ''
    });
    setUnitFilter('all');
  };

  const hasActiveFilters = searchValues.id || searchValues.description || searchValues.status || searchValues.date_perfomance || searchValues.date_created || searchValues.unit_name || unitFilter !== 'all';

  return (
    <tr className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 overflow-visible">
      <td className="px-4 py-3 w-30">
        <Input
          type="text"
          value={searchValues.id}
          onChange={(e) => handleChange('id', e.target.value)}
          placeholder="Search ID..."
          className="w-full text-[11px]"
        />
      </td>
      <td className="px-6 py-3">
        <Input
          type="text"
          value={searchValues.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Search description..."
          className="w-full text-[11px]"
        />
      </td>
      <td className="px-6 py-3">
        <Select 
          value={searchValues.status || 'all'} 
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger className="w-full text-[11px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Editable">Editable</SelectItem>
            <SelectItem value="Locked">Locked</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="px-6 py-3 overflow-visible">
        <CalendarDropdown
          value={searchValues.date_perfomance}
          placeholder="Select performance date..."
          onChange={(date) => handleChange('date_perfomance', date)}
        />
      </td>
      <td className="px-6 py-3 overflow-visible">
        <CalendarDropdown
          value={searchValues.date_created}
          placeholder="Select created date..."
          onChange={(date) => handleChange('date_created', date)}
        />
      </td>
      <td className="px-6 py-3">
        <Input
          type="text"
          value={searchValues.unit_name}
          onChange={(e) => handleChange('unit_name', e.target.value)}
          placeholder="Search unit name..."
          className="w-full text-[11px]"
        />
      </td>
      <td className="px-6 py-3">
        {/* Actions column - empty for search row */}
      </td>
    </tr>
  );
} 