import { Performance } from '@/data/mockPerformanceData';
import { Edit2, Save, X, Trash2 } from 'lucide-react';

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

export function PerformanceTableRow({
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
}: PerformanceTableRowProps) {
  const cellClasses = "px-6 py-4 text-sm whitespace-nowrap";
  const inputClasses = "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-primary dark:focus:border-primary transition-colors";

  if (isEditing) {
    return (
      <tr className="bg-blue-50/50 dark:bg-blue-900/20 transition-colors">
        <td className={`${cellClasses} px-4 w-20 font-medium text-gray-900 dark:text-gray-200`}>{performance.id}</td>
        <td className={cellClasses}>
          <div className="relative">
            <input
              type="text"
              value={editForm.description || ''}
              onChange={(e) => onEditFormChange('description', e.target.value)}
              className={inputClasses}
              placeholder="Enter description"
            />
            {showEditTooltip && (
              <div className="absolute top-full left-0 mt-1 px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10">
                {editTooltipMessage}
              </div>
            )}
          </div>
        </td>
        <td className={cellClasses}>
          <select
            value={editForm.status || ''}
            onChange={(e) => onEditFormChange('status', e.target.value)}
            className={inputClasses}
          >
            <option value="Editable">Editable</option>
            <option value="Locked">Locked</option>
          </select>
        </td>
        <td className={cellClasses}>
          <input
            type="date"
            value={editForm.date_perfomance || ''}
            onChange={(e) => onEditFormChange('date_perfomance', e.target.value)}
            className={inputClasses}
          />
        </td>
        <td className={`${cellClasses} text-gray-500 dark:text-gray-400`}>{performance.date_created}</td>
        <td className={`${cellClasses} text-center text-gray-500 dark:text-gray-400`}>{performance.unit_name}</td>
        <td className={`${cellClasses} text-right space-x-3`}>
          <button
            onClick={onSaveEdit}
            className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={onCancelEdit}
            className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
      <td className={`${cellClasses} px-4 w-20 font-medium text-gray-900 dark:text-gray-200`}>{performance.id}</td>
      <td className={`${cellClasses} text-gray-700 dark:text-gray-300`}>{performance.description}</td>
      <td className={cellClasses}>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
          performance.status === 'Editable'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-1 ring-green-600/20 dark:ring-green-400/30'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-600/20 dark:ring-red-400/30'
        }`}>
          {performance.status}
        </span>
      </td>
      <td className={`${cellClasses} text-gray-700 dark:text-gray-300`}>{performance.date_perfomance}</td>
      <td className={`${cellClasses} text-gray-700 dark:text-gray-300`}>{performance.date_created}</td>
      <td className={`${cellClasses} text-center text-gray-700 dark:text-gray-300`}>{performance.unit_name}</td>
      <td className={`${cellClasses} text-right space-x-2`}>
        <button
          onClick={() => onEdit(performance)}
          disabled={performance.status !== 'Editable'}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            performance.status === 'Editable'
              ? 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(performance.id)}
          disabled={performance.status !== 'Editable'}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            performance.status === 'Editable'
              ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
} 