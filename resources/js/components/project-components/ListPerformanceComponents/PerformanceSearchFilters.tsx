import React from 'react';

interface SearchValues {
  id: string;
  description: string;
  status: string;
  date_perfomance: string;
  date_created: string;
  unit_name: string;
}

interface PerformanceSearchFiltersProps {
  searchValues: SearchValues;
  onIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDatePerformanceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateCreatedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUnitNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PerformanceSearchFilters: React.FC<PerformanceSearchFiltersProps> = ({
  searchValues,
  onIdChange,
  onDescriptionChange,
  onStatusChange,
  onDatePerformanceChange,
  onDateCreatedChange,
  onUnitNameChange
}) => {
  return (
    <tr className="bg-white dark:bg-gray-900">
      <td className="px-6 py-4">
        <input
          type="text"
          value={searchValues.id}
          onChange={onIdChange}
          placeholder="Search ID..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          value={searchValues.description}
          onChange={onDescriptionChange}
          placeholder="Search description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="date"
          value={searchValues.date_perfomance}
          onChange={onDatePerformanceChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </td>
      <td className="px-6 py-4">
        <input
          type="date"
          value={searchValues.date_created}
          onChange={onDateCreatedChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </td>
      <td className="px-6 py-4">
        <select
          value={searchValues.status}
          onChange={onStatusChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="Editable">Editable</option>
          <option value="Non-Editable">Non-Editable</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          value={searchValues.unit_name}
          onChange={onUnitNameChange}
          placeholder="Search unit name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </td>
      <td className="px-6 py-4">
        {/* Actions column - empty for search row */}
      </td>
    </tr>
  );
}; 