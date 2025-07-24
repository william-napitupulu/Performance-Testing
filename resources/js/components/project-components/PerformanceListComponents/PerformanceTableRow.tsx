import { Performance } from '@/data/mockPerformanceData';
import { Edit2, Save, Trash2, X } from 'lucide-react';

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
    onEditFormChange,
}: PerformanceTableRowProps) {
    const cellClasses = 'px-6 py-4 text-sm whitespace-nowrap';
    const inputClasses =
        'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors';

    if (isEditing) {
        return (
            <tr className="bg-blue-50/50 transition-colors dark:bg-blue-900/20">
                <td className={`${cellClasses} w-20 px-4 text-center`}>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                        {performance.id}
                    </span>
                </td>
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
                            <div className="absolute top-full left-0 z-10 mt-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white shadow-lg">
                                {editTooltipMessage}
                            </div>
                        )}
                    </div>
                </td>
                <td className={cellClasses}>
                    <select value={editForm.status || ''} onChange={(e) => onEditFormChange('status', e.target.value)} className={inputClasses}>
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
                <td className={`${cellClasses} font-medium text-fuchsia-600 dark:text-fuchsia-400`}>{performance.date_created}</td>
                <td className={`${cellClasses} text-center font-medium text-cyan-600 dark:text-cyan-400`}>{performance.unit_name}</td>
                <td className={cellClasses}>
                    <select value={editForm.type || ''} onChange={(e) => onEditFormChange('type', e.target.value)} className={inputClasses}>
                        <option value="">Select type...</option>
                        <option value="Rutin">Rutin</option>
                        <option value="Sebelum OH">Sebelum OH</option>
                        <option value="Paska OH">Paska OH</option>
                        <option value="Puslitbang">Puslitbang</option>
                    </select>
                </td>
                <td className={cellClasses}>
                    <select value={editForm.weight || ''} onChange={(e) => onEditFormChange('weight', e.target.value)} className={inputClasses}>
                        <option value="">Select weight...</option>
                        <option value="Beban 1">Beban 1</option>
                        <option value="Beban 2">Beban 2</option>
                        <option value="Beban 3">Beban 3</option>
                    </select>
                </td>
                <td className={`${cellClasses} space-x-3 text-right`}>
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
        <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td className={`${cellClasses} w-20 px-4 text-center`}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                    {performance.id}
                </span>
            </td>
            <td className={`${cellClasses} font-medium text-blue-700 dark:text-blue-300`}>{performance.description}</td>
            <td className={cellClasses}>
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        performance.status === 'Editable'
                            ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/30'
                            : 'bg-red-100 text-red-700 ring-1 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/30'
                    }`}
                >
                    {performance.status}
                </span>
            </td>
            <td className={`${cellClasses} font-medium text-violet-700 dark:text-violet-300`}>{performance.date_perfomance}</td>
            <td className={`${cellClasses} font-medium text-fuchsia-700 dark:text-fuchsia-300`}>{performance.date_created}</td>
            <td className={`${cellClasses} text-center font-medium text-cyan-700 dark:text-cyan-300`}>{performance.unit_name}</td>
            <td className={`${cellClasses} text-center font-medium text-orange-700 dark:text-orange-300`}>{performance.type || 'N/A'}</td>
            <td className={`${cellClasses} text-center font-medium text-purple-700 dark:text-purple-300`}>{performance.weight || 'N/A'}</td>
            <td className={`${cellClasses} space-x-2 text-right`}>
                <button
                    onClick={() => onEdit(performance)}
                    disabled={performance.status !== 'Editable'}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        performance.status === 'Editable'
                            ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300'
                            : 'cursor-not-allowed text-gray-400'
                    }`}
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(performance.id)}
                    disabled={performance.status !== 'Editable'}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        performance.status === 'Editable'
                            ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                            : 'cursor-not-allowed text-gray-400'
                    }`}
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );
}
