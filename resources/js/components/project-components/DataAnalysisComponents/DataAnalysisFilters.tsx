import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface FilterValues {
  tag_no: string;
  description: string;
  min_from: string;
  min_to: string;
  max_from: string;
  max_to: string;
  average_from: string;
  average_to: string;
}

interface DataAnalysisFiltersProps {
  onFilterChange: (filters: {
    filter_tag_no?: string;
    filter_value_min?: string;
    filter_value_max?: string;
    filter_description?: string;
    filter_min_from?: string;
    filter_min_to?: string;
    filter_max_from?: string;
    filter_max_to?: string;
    filter_average_from?: string;
    filter_average_to?: string;
  }) => void;
}

export const DataAnalysisFilters = React.memo(function DataAnalysisFilters({ onFilterChange }: DataAnalysisFiltersProps) {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    tag_no: '',
    description: '',
    min_from: '',
    min_to: '',
    max_from: '',
    max_to: '',
    average_from: '',
    average_to: ''
  });

  useEffect(() => {
    // Debounce the filter changes
    const timeoutId = setTimeout(() => {
      const filters: any = {};
      
      if (filterValues.tag_no) filters.filter_tag_no = filterValues.tag_no;
      if (filterValues.description) filters.filter_description = filterValues.description;
      if (filterValues.min_from) filters.filter_min_from = filterValues.min_from;
      if (filterValues.min_to) filters.filter_min_to = filterValues.min_to;
      if (filterValues.max_from) filters.filter_max_from = filterValues.max_from;
      if (filterValues.max_to) filters.filter_max_to = filterValues.max_to;
      if (filterValues.average_from) filters.filter_average_from = filterValues.average_from;
      if (filterValues.average_to) filters.filter_average_to = filterValues.average_to;
      
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filterValues]);

  const handleChange = (field: keyof FilterValues, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilterValues({
      tag_no: '',
      description: '',
      min_from: '',
      min_to: '',
      max_from: '',
      max_to: '',
      average_from: '',
      average_to: ''
    });
  };

  const hasActiveFilters = Object.values(filterValues).some(value => value !== '');

  return (
    <tr className="bg-blue-50/30 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800/50">
      {/* No column - empty */}
      <td className="px-4 py-3 text-center">
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            title="Clear all filters"
            className="inline-flex items-center justify-center w-6 h-6 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </td>
      
      {/* Tag No filter */}
      <td className="px-6 py-3">
        <Input
          type="text"
          value={filterValues.tag_no}
          onChange={(e) => handleChange('tag_no', e.target.value)}
          placeholder="Search tag..."
          className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </td>
      
      {/* Description filter */}
      <td className="px-6 py-3">
        <Input
          type="text"
          value={filterValues.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Search description..."
          className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </td>
      
      {/* Min range filter */}
      <td className="px-6 py-3">
        <div className="flex space-x-1">
          <Input
            type="number"
            value={filterValues.min_from}
            onChange={(e) => handleChange('min_from', e.target.value)}
            placeholder="From"
            className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            step="0.01"
          />
          <Input
            type="number"
            value={filterValues.min_to}
            onChange={(e) => handleChange('min_to', e.target.value)}
            placeholder="To"
            className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            step="0.01"
          />
        </div>
      </td>
      
      {/* Max range filter */}
      <td className="px-6 py-3">
        <div className="flex space-x-1">
          <Input
            type="number"
            value={filterValues.max_from}
            onChange={(e) => handleChange('max_from', e.target.value)}
            placeholder="From"
            className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            step="0.01"
          />
          <Input
            type="number"
            value={filterValues.max_to}
            onChange={(e) => handleChange('max_to', e.target.value)}
            placeholder="To"
            className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            step="0.01"
          />
        </div>
      </td>
      
      {/* Average range filter */}
      <td className="px-6 py-3">
        <div className="flex space-x-1">
          <Input
            type="number"
            value={filterValues.average_from}
            onChange={(e) => handleChange('average_from', e.target.value)}
            placeholder="From"
            className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            step="0.01"
          />
          <Input
            type="number"
            value={filterValues.average_to}
            onChange={(e) => handleChange('average_to', e.target.value)}
            placeholder="To"
            className="w-full text-[11px] h-8 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            step="0.01"
          />
        </div>
      </td>
    </tr>
  );
}); 