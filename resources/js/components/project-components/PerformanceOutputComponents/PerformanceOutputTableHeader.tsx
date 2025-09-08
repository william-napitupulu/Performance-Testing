import { Performance } from '@/data/mockPerformanceData';
import { ArrowUpDown } from 'lucide-react';

interface PerformanceTableHeaderProps {
    onSort: (field: keyof Performance) => void;
    sortField?: keyof Performance | null;
    sortDirection?: 'asc' | 'desc';
}

export function PerformanceTableHeader({ onSort, sortField, sortDirection }: PerformanceTableHeaderProps) {
    const renderSortIcon = (field: keyof Performance) => {
        const iconBaseClasses = 'h-3.5 w-3.5 ml-1.5 transition-colors';
        const iconColor = getHeaderColor(field);

        if (sortField !== field) {
            return <ArrowUpDown className={`${iconBaseClasses} ${iconColor}`} />;
        }
        return <ArrowUpDown className={`${iconBaseClasses} ${iconColor} ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />;
    };

    const getHeaderColor = (field: keyof Performance) => {
        switch (field) {
            case 'id':
                return 'text-indigo-700 dark:text-indigo-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'description':
                return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'status':
                return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'date_perfomance':
                return 'text-violet-700 dark:text-violet-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'date_created':
                return 'text-fuchsia-700 dark:text-fuchsia-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'type':
                return 'text-orange-700 dark:text-orange-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'weight':
                return 'text-purple-700 dark:text-purple-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            default:
                return 'text-gray-600 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300';
        }
    };

    const headerBaseClasses =
        'group py-2.5 text-[11px] font-medium uppercase tracking-wider select-none cursor-pointer hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors';

    return (
        <thead className="border-y border-blue-100 bg-blue-50/30 dark:border-gray-700 dark:bg-blue-900/10">
            <tr>
                <th className={`${headerBaseClasses} w-1/12 px-4 ${getHeaderColor('id')}`} onClick={() => onSort('id')}>
                    <div className="flex items-center justify-center">Perf ID {renderSortIcon('id')}</div>
                </th>
                <th className={`${headerBaseClasses} w-3/12 px-6 ${getHeaderColor('description')}`} onClick={() => onSort('description')}>
                    <div className="flex items-center">Description {renderSortIcon('description')}</div>
                </th>
                <th className={`${headerBaseClasses} w-2/12 px-6 ${getHeaderColor('date_perfomance')}`} onClick={() => onSort('date_perfomance')}>
                    <div className="flex items-center justify-center">Performance Date {renderSortIcon('date_perfomance')}</div>
                </th>
                <th className={`${headerBaseClasses} w-2/12 px-6 ${getHeaderColor('type')}`} onClick={() => onSort('type')}>
                    <div className="flex items-center justify-center">Type {renderSortIcon('type')}</div>
                </th>
                <th
                    className={`${headerBaseClasses} w-2/12 px-6 text-center text-amber-700 group-hover:text-green-700 dark:text-amber-300 dark:group-hover:text-green-300`}
                >
                    Actions
                </th>
            </tr>
        </thead>
    );
}
