import React from 'react';
import { Performance } from '@/data/mockPerformanceData';
import { PerformanceValidationTooltip } from './PerformanceValidationTooltip';
import { PerformanceDateTimeInput } from './PerformanceDateTimeInput';
import { Save, X } from 'lucide-react';

interface PerformanceAddRowProps {
  newForm: Partial<Performance>;
  showTooltip: boolean;
  tooltipMessage: string;
  selectedUnitName?: string;
  onNewFormChange: (field: keyof Performance, value: string | number) => void;
  onAddNew: () => void;
  onCancelAdd: () => void;
}

export const PerformanceAddRow: React.FC<PerformanceAddRowProps> = ({
  newForm,
  showTooltip,
  tooltipMessage,
  selectedUnitName,
  onNewFormChange,
  onAddNew,
  onCancelAdd
}) => {
  return (
    <tr className="bg-blue-50 border-b dark:bg-blue-900/20 dark:border-gray-700">
      <td className="px-6 py-4 text-center font-medium text-gray-500 dark:text-gray-400">
        Auto-generated
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <input
            type="text"
            value={newForm.description || ''}
            onChange={(e) => onNewFormChange('description', e.target.value)}
            placeholder="Enter description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <PerformanceValidationTooltip
            show={showTooltip}
            message={tooltipMessage}
            className="top-full left-0 mt-1"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <PerformanceDateTimeInput
          value={newForm.date_perfomance || ''}
          onChange={(e) => onNewFormChange('date_perfomance', e.target.value)}
          type="date"
        />
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
        Auto-generated
      </td>
      <td className="px-6 py-4">
        <select
          value={newForm.status || 'Editable'}
          onChange={(e) => onNewFormChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="Editable">Editable</option>
          <option value="Non-Editable">Non-Editable</option>
        </select>
      </td>
      <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
        {selectedUnitName || `Unit ${newForm.unit_id}` || 'Auto'}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-center space-x-2">
          <button
            onClick={onAddNew}
            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Save"
          >
            <Save className="h-5 w-5" />
          </button>
          <button
            onClick={onCancelAdd}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Cancel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}; 