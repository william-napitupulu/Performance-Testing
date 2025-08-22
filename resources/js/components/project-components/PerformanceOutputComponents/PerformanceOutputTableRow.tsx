import { Performance } from '@/data/mockPerformanceData';
import { Save, X } from 'lucide-react';

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
    isDeleting?: boolean;
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
    onEditFormChange,
    isDeleting = false,
}: PerformanceTableRowProps) {
    const cellClasses = 'px-6 py-4 text-sm';
    const inputClasses =
        'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors';

    if (isEditing) {
        return (
            <tr className="bg-blue-50/50 transition-colors dark:bg-blue-900/20">
                <td className={`${cellClasses} w-1/12 text-center`}>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                        {performance.id}
                    </span>
                </td>
                <td className={`${cellClasses} max-w-md`}>
                    <div className="relative">
                        <input
                            type="text"
                            value={editForm.description || ''}
                            onChange={(e) => onEditFormChange('description', e.target.value)}
                            className={inputClasses}
                            placeholder="Enter description"
                        />
                        {showEditTooltip && (
                            <div className="absolute top-full left-0 z-10 mt-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white shadow-lg">
                                {editTooltipMessage}
                            </div>
                        )}
                    </div>
                </td>
                <td className={cellClasses}>
                    <input
                        type="date"
                        value={editForm.date_perfomance || ''}
                        onChange={(e) => onEditFormChange('date_perfomance', e.target.value)}
                        className={inputClasses}
                    />
                </td>
                <td className={`${cellClasses} w-48 text-center font-medium text-cyan-600 dark:text-cyan-400`}>{performance.unit_name}</td>
                <td className={`${cellClasses} w-40`}>
                    <select value={editForm.type || ''} onChange={(e) => onEditFormChange('type', e.target.value)} className={inputClasses}>
                        <option value="">Select type...</option>
                        <option value="Rutin">Rutin</option>
                        <option value="Sebelum OH">Sebelum OH</option>
                        <option value="Paska OH">Paska OH</option>
                        <option value="Puslitbang">Puslitbang</option>
                    </select>
                </td>
                <td className={`${cellClasses} w-32 space-x-3 text-right`}>
                    <button
                        onClick={onSaveEdit}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-green-600 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                    >
                        <Save className="h-4 w-4" />
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-300"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <tr className={`transition-all duration-300 ${
            isDeleting 
                ? 'opacity-50 bg-red-50 dark:bg-red-900/10 animate-pulse' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}>
            <td className={`${cellClasses} text-center`}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                    {performance.id}
                </span>
            </td>
            <td className={`${cellClasses} font-medium text-blue-700 dark:text-blue-300`}>{performance.description}</td>
            <td className={`${cellClasses} text-center font-medium text-violet-700 dark:text-violet-300`}>{performance.date_perfomance}</td>
            <td className={`${cellClasses} text-center font-medium text-cyan-700 dark:text-cyan-300`}>{performance.unit_name}</td>
            <td className={`${cellClasses} text-center font-medium text-orange-700 dark:text-orange-300`}>{performance.type || 'N/A'}</td>
            <td className={`${cellClasses} space-x-2 text-center`}>
                <button
                    onClick={() => onEdit(performance)}
                    disabled={performance.status !== 'Editable'}
                    className={`inline-flex items-center justify-center rounded-full transition-colors ${
                        performance.status === 'Editable'
                            ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300'
                            : 'cursor-not-allowed text-gray-400'
                    }`}
                >
                    Details
                </button>
            </td>
        </tr>
    );
}
