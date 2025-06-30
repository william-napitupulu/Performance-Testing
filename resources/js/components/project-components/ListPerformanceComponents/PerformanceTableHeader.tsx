import React from 'react';
import { Performance } from '@/data/mockPerformanceData';

interface PerformanceTableHeaderProps {
  onSort: (key: keyof Performance) => void;
}

export const PerformanceTableHeader: React.FC<PerformanceTableHeaderProps> = ({ onSort }) => {
  return (
    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
      <tr>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/20 transition-colors"
          onClick={() => onSort('id')}
        >
          Perf ID ↕
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider cursor-pointer hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/20 transition-colors"
          onClick={() => onSort('description')}
        >
          Description ↕
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider cursor-pointer hover:bg-purple-100 dark:text-purple-300 dark:hover:bg-purple-900/20 transition-colors"
          onClick={() => onSort('date_perfomance')}
        >
          Performance Date ↕
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider cursor-pointer hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/20 transition-colors"
          onClick={() => onSort('date_created')}
        >
          Date Created ↕
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/20 transition-colors"
          onClick={() => onSort('status')}
        >
          Status ↕
        </th>
        <th 
          className="px-6 py-3 text-left text-xs font-medium text-cyan-700 uppercase tracking-wider cursor-pointer hover:bg-cyan-100 dark:text-cyan-300 dark:hover:bg-cyan-900/20 transition-colors"
          onClick={() => onSort('unit_name')}
        >
          Unit Name ↕
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider dark:text-red-300">
          Actions
        </th>
      </tr>
    </thead>
  );
}; 