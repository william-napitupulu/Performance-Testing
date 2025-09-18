import { Baseline } from '@/data/baselineData';
import { ArrowUpDown } from 'lucide-react';

interface BaselineTableHeaderProps {
    onSort: (field: keyof Baseline) => void;
    sortField?: keyof Baseline | null;
    sortDirection: 'asc' | 'desc' | null;
}

export function BaselineTableHeader({ onSort, sortField, sortDirection }: BaselineTableHeaderProps) {
    const headerClasses = "group px-6 py-3 text-xs font-medium uppercase tracking-wider cursor-pointer";
    
    const renderSortIcon = (field: keyof Baseline) => {
        const iconBaseClasses = 'h-4 w-4 ml-2 opacity-30 group-hover:opacity-100';
        if (sortField === field) {
            return <ArrowUpDown className={`${iconBaseClasses} opacity-100 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />;
        }
        return <ArrowUpDown className={iconBaseClasses} />;
    };

    return (
        <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
                <th className={`${headerClasses} w-1/12 px-4`} onClick={() => onSort('reff_id')}>
                    <div className="flex items-center justify-center text-indigo-700 dark:text-indigo-300 group-hover:text-green-700 dark:group-hover:text-green-300">
                        ID
                        {renderSortIcon('reff_id')}
                    </div>
                </th>
                <th className={`${headerClasses} w-3/12 px-6`} onClick={() => onSort('description')}>
                    <div className="flex items-center text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300">
                        Description
                        {renderSortIcon('description')}
                    </div>
                </th>
                <th className={`${headerClasses} w-3/12`} onClick={() => onSort('keterangan')}>
                    <div className="flex items-center text-violet-700 dark:text-violet-300 group-hover:text-green-700 dark:group-hover:text-green-300">
                        Notes
                        {renderSortIcon('keterangan')}
                    </div>
                </th>
                <th className={`${headerClasses} w-1/12`} onClick={() => onSort('is_default')}>
                    <div className="flex items-center justify-center text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300">
                        Default
                        {renderSortIcon('is_default')}
                    </div>
                </th>
                <th className={`${headerClasses} w-2/12`} onClick={() => onSort('date_created')}>
                    <div className="flex items-center justify-center text-orange-700 dark:text-orange-300 group-hover:text-green-700 dark:group-hover:text-green-300">
                        Date Created
                        {renderSortIcon('date_created')}
                    </div>
                </th>
                <th className={`${headerClasses} w-2/12 text-center text-gray-600 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300`}>Actions</th>
            </tr>
        </thead>
    );
}
