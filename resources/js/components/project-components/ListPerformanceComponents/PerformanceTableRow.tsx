import React from 'react';
import { Performance } from '@/data/mockPerformanceData';
import { PerformanceValidationTooltip } from './PerformanceValidationTooltip';
import { PerformanceDateTimeInput } from './PerformanceDateTimeInput';
import { Edit, Trash2, Save, X } from 'lucide-react';

interface PerformanceTableRowProps {
  performance: Performance;
  isEditing: boolean;
  editForm: Partial<Performance>;
  showEditTooltip: boolean;
  editTooltipMessage: string;
  onEdit: (performance: Performance) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onEditFormChange: (field: keyof Performance, value: string | number) => void;
}

export const PerformanceTableRow: React.FC<PerformanceTableRowProps> = ({
  performance,
  isEditing,
  editForm,
  showEditTooltip,
  editTooltipMessage,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditFormChange
}) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
        {performance.id}
      </td>
      <td className="px-6 py-4 text-gray-900 dark:text-white">
        {isEditing ? (
          <div className="relative">
            <input
              type="text"
              value={editForm.description || ''}
              onChange={(e) => onEditFormChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <PerformanceValidationTooltip
              show={showEditTooltip}
              message={editTooltipMessage}
              className="top-full left-0 mt-1"
            />
          </div>
        ) : (
          performance.description
        )}
      </td>
      <td className="px-6 py-4 text-gray-900 dark:text-white">
        {isEditing ? (
          <PerformanceDateTimeInput
            value={editForm.date_perfomance || ''}
            onChange={(e) => onEditFormChange('date_perfomance', e.target.value)}
            type="date"
          />
        ) : (
          performance.date_perfomance
        )}
      </td>
      <td className="px-6 py-4 text-gray-900 dark:text-white">
        {performance.date_created}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <select
            value={editForm.status || ''}
            onChange={(e) => onEditFormChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Editable">Editable</option>
            <option value="Non-Editable">Non-Editable</option>
          </select>
        ) : (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            performance.status === 'Editable' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {performance.status}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-center text-gray-900 dark:text-white">
        {performance.unit_name || `Unit ${performance.unit_id}`}
      </td>
      <td className="px-6 py-4 text-right">
        {isEditing ? (
          <div className="flex justify-center space-x-2">
            <button
              onClick={onSaveEdit}
              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Save"
            >
              <Save className="h-5 w-5" />
            </button>
            <button
              onClick={onCancelEdit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Cancel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => onEdit(performance)}
              disabled={performance.status !== 'Editable'}
              className={`p-2 rounded-lg transition-colors ${
                performance.status === 'Editable'
                  ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20'
                  : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
              }`}
              title="Edit"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(performance.id)}
              disabled={performance.status !== 'Editable'}
              className={`p-2 rounded-lg transition-colors ${
                performance.status === 'Editable'
                  ? 'text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20'
                  : 'text-gray-400 cursor-not-allowed dark:text-gray-600'
              }`}
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}; 