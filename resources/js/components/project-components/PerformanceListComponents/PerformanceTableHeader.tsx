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
            case 'unit_name':
                return 'text-cyan-700 dark:text-cyan-300 group-hover:text-green-700 dark:group-hover:text-green-300';
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
        <thead className="border-blue-100 border-y bg-blue-50/30 dark:border-gray-700 dark:bg-blue-900/10">
            <tr>
                <th className={`${headerBaseClasses} w-30 px-4 ${getHeaderColor('id')}`} onClick={() => onSort('id')}>
                    <div className="flex items-center">Perf ID {renderSortIcon('id')}</div>
                </th>
                <th className={`${headerBaseClasses} px-6 ${getHeaderColor('description')}`} onClick={() => onSort('description')}>
                    <div className="flex items-center">Description {renderSortIcon('description')}</div>
                </th>
                <th className={`${headerBaseClasses} px-6 ${getHeaderColor('status')}`} onClick={() => onSort('status')}>
                    <div className="flex items-center">Status {renderSortIcon('status')}</div>
                </th>
                <th className={`${headerBaseClasses} px-6 ${getHeaderColor('date_perfomance')}`} onClick={() => onSort('date_perfomance')}>
                    <div className="flex items-center">Performance Date {renderSortIcon('date_perfomance')}</div>
                </th>
                <th className={`${headerBaseClasses} px-6 ${getHeaderColor('date_created')}`} onClick={() => onSort('date_created')}>
                    <div className="flex items-center">Date Created {renderSortIcon('date_created')}</div>
                </th>
                <th className={`${headerBaseClasses} px-6 ${getHeaderColor('unit_name')}`} onClick={() => onSort('unit_name')}>
                    <div className="flex items-center">Unit Name {renderSortIcon('unit_name')}</div>
                </th>
                <th className={`${headerBaseClasses} px-6 ${getHeaderColor('type')}`} onClick={() => onSort('type')}>
                    <div className="flex items-center">Type {renderSortIcon('type')}</div>
                </th>
                <th className={`${headerBaseClasses} px-6 ${getHeaderColor('weight')}`} onClick={() => onSort('weight')}>
                    <div className="flex items-center">Weight {renderSortIcon('weight')}</div>
                </th>
                <th
                    className={`${headerBaseClasses} px-6 text-center text-green-700 group-hover:text-green-700 dark:text-green-300 dark:group-hover:text-green-300`}
                >Output</th>
                <th
                    className={`${headerBaseClasses} px-6 text-center text-amber-700 group-hover:text-green-700 dark:text-amber-300 dark:group-hover:text-green-300`}
                >
                    Actions
                </th>
            </tr>
        </thead>
    );
}
