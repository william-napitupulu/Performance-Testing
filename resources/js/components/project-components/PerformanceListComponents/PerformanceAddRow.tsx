import { Performance } from '@/data/mockPerformanceData';
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

export function PerformanceAddRow({
    newForm,
    showTooltip,
    tooltipMessage,
    selectedUnitName,
    onNewFormChange,
    onAddNew,
    onCancelAdd,
}: PerformanceAddRowProps) {
    const cellClasses = 'px-6 py-4 text-sm text-gray-700 dark:text-gray-300';
    const inputClasses =
        'w-full px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600';

    return (
        <tr className="bg-green-50 dark:bg-green-900/10">
            <td className={cellClasses}>New</td>
            <td className={cellClasses}>
                <div className="relative">
                    <input
                        type="text"
                        value={newForm.description || ''}
                        onChange={(e) => onNewFormChange('description', e.target.value)}
                        placeholder="Enter description"
                        className={inputClasses}
                    />
                    {showTooltip && (
                        <div className="absolute top-full left-0 mt-1 rounded bg-red-500 px-2 py-1 text-xs text-white shadow-lg">
                            {tooltipMessage}
                        </div>
                    )}
                </div>
            </td>
            <td className={cellClasses}>
                <select value={newForm.status || 'Draft'} onChange={(e) => onNewFormChange('status', e.target.value)} className={inputClasses}>
                    <option value="Draft">Draft</option>
                    <option value="Finished">Finished</option>
                </select>
            </td>
            <td className={cellClasses}>
                <input
                    type="date"
                    value={newForm.date_perfomance || ''}
                    onChange={(e) => onNewFormChange('date_perfomance', e.target.value)}
                    className={inputClasses}
                />
            </td>
            <td className={cellClasses}>Auto-generated</td>
            <td className={cellClasses}>{selectedUnitName || 'Current Unit'}</td>
            <td className={`${cellClasses} space-x-2 text-right`}>
                <button onClick={onAddNew} className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                    <Save className="h-4 w-4" />
                </button>
                <button onClick={onCancelAdd} className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <X className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );
}
