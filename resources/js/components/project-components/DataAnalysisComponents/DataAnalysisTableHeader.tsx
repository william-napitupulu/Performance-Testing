import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface DataAnalysisTableHeaderProps {
  sortField: string;
  sortDirection: string;
  onSort: (field: string) => void;
}

export function DataAnalysisTableHeader({
  sortField,
  sortDirection,
  onSort
}: DataAnalysisTableHeaderProps) {
  const renderSortIcon = (field: string) => {
    const iconBaseClasses = "h-3.5 w-3.5 ml-1.5 transition-colors";
    const iconColor = getHeaderColor(field);
    
    if (sortField !== field) {
      return <ArrowUpDown className={`${iconBaseClasses} ${iconColor}`} />;
    }
    return (
      <ArrowUpDown 
        className={`${iconBaseClasses} ${iconColor} ${
          sortDirection === 'desc' ? 'rotate-180' : ''
        }`}
      />
    );
  };

  const getHeaderColor = (field: string) => {
    switch (field) {
      case 'no':
        return 'text-indigo-700 dark:text-indigo-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'tag_no':
        return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'value':
        return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'date_rec':
        return 'text-violet-700 dark:text-violet-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      default:
        return 'text-gray-600 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300';
    }
  };

  const headerBaseClasses = "group py-2.5 text-[11px] font-medium uppercase tracking-wider select-none cursor-pointer hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors";

  return (
    <thead className="bg-blue-50/70 dark:bg-gray-800/70 border-y border-blue-100 dark:border-gray-700">
      <tr>
        <th className={`${headerBaseClasses} px-4 w-30 ${getHeaderColor('no')}`} onClick={() => onSort('no')}>
          <div className="flex justify-center">
            No {renderSortIcon('no')}
          </div>
        </th>
        <th className={`${headerBaseClasses} px-6 ${getHeaderColor('tag_no')}`} onClick={() => onSort('tag_no')}>
          <div className="flex items-center">
            Tag No {renderSortIcon('tag_no')}
          </div>
        </th>
        <th className={`${headerBaseClasses} px-6 ${getHeaderColor('value')}`} onClick={() => onSort('value')}>
          <div className="flex justify-center">
            Value {renderSortIcon('value')}
          </div>
        </th>
        <th className={`${headerBaseClasses} px-6 ${getHeaderColor('date_rec')}`} onClick={() => onSort('date_rec')}>
          <div className="flex items-center">
            Date {renderSortIcon('date_rec')}
          </div>
        </th>
      </tr>
    </thead>
  );
} 