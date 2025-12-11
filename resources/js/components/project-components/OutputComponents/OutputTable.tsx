import { ArrowUpDown, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
// COMMENTED OUT: Pagination icons no longer needed
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { OutputData, ApiResponse } from './types';
import { Input } from "@headlessui/react";

interface OutputTableProps {
    data: OutputData[];
    loading: boolean;
    sort: ApiResponse['sort'];
    pagination: ApiResponse['pagination'];
    onSort: (field: string) => void;
    onFilterChange: (params: {search: string}) => void;
    searchValue: string;
}

export const OutputTable = React.memo(function OutputTable({
    data,
    loading,
    sort,
    pagination,
    onSort,
    onFilterChange,
    searchValue,
}: OutputTableProps) {
    const handleSort = (field: string) => {
        onSort(field);
    };

    const [localSearch, setLocalSearch] = useState(searchValue);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (localSearch !== searchValue) {
                onFilterChange({ search: localSearch })
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [localSearch, searchValue, onFilterChange]);

    const renderSortIcon = (field: string) => {
        const iconBaseClasses = 'h-3.5 w-3.5 ml-1.5 transition-colors';
        const iconColor = getHeaderColor(field);

        if (sort.field !== field) {
            return <ArrowUpDown className={`${iconBaseClasses} ${iconColor}`} />;
        }
        return <ArrowUpDown className={`${iconBaseClasses} ${iconColor} ${sort.direction === 'desc' ? 'rotate-180' : ''}`} />;
    };

    const getHeaderColor = (field: string) => {
        switch (field) {
            case 'no':
                return 'text-indigo-700 dark:text-indigo-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'output_id':
                return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'description':
                return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'value':
                return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            case 'satuan':
                return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
            default:
                return 'text-gray-600 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300';
        }
    };

    const headerBaseClasses =
        'group py-2.5 text-[11px] font-medium uppercase tracking-wider select-none cursor-pointer hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors';

    // NEW: Simple stats display without pagination
    const renderStats = () => {
        if (!pagination || pagination.total === 0) return null;

        const { total } = pagination;

        return (
            <div className="border-t border-border bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Showing all <span className="font-medium">{total}</span> results
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-blue-100 bg-blue-50/70 px-6 py-4 dark:border-blue-800/50 dark:bg-blue-900/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Output Data Results</h3>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Total Records: {pagination?.total || 0}</div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <Input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search table..."
                            className="w-full sm:w-64 rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
                    <thead className="border-y border-blue-100 bg-blue-50/70 dark:border-gray-700 dark:bg-gray-800/70">
                        <tr>
                            <th className={`${headerBaseClasses} px-4 text-center text-indigo-700 dark:text-indigo-300`}>
                                <div className="flex items-center justify-center">No</div>
                            </th>
                            <th className={`${headerBaseClasses} justify-center px-4 ${getHeaderColor('output_id')}`} onClick={() => handleSort('output_id')}>
                                <div className="text-center flex items-center">Output ID {renderSortIcon('output_id')}</div>
                            </th>
                            <th className={`${headerBaseClasses} px-6 ${getHeaderColor('description')}`} onClick={() => handleSort('description')}>
                                <div className="flex items-center">Description {renderSortIcon('description')}</div>
                            </th>
                            <th className={`${headerBaseClasses} px-6 ${getHeaderColor('value')}`} onClick={() => handleSort('description')}>
                                <div className="flex items-center">Value {renderSortIcon('value')}</div>
                            </th>
                            <th className={`${headerBaseClasses} px-6 text-center ${getHeaderColor('satuan')}`} onClick={() => handleSort('min')}>
                                <div className="flex items-center justify-center">Satuan {renderSortIcon('satuan')}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="mr-2 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                        <span className="text-blue-600 dark:text-blue-400">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.id || `data-row-${index}`} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-4 py-4 text-center">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                                            {item.no}
                                        </span>
                                    </td>
                                    <td className="px-10 py-4 font-medium text-blue-700 dark:text-blue-300">{item.output_id}</td>
                                    <td className="px-6 py-4 font-medium text-blue-700 dark:text-blue-300">{item.description}</td>
                                    <td className="px-6 py-4 font-medium text-blue-700 dark:text-blue-300">
                                        {item.value !== null && item.value !== '' && !isNaN(Number(item.value)) ? Number(item.value).toFixed(2) : item.value}
                                    </td>
                                    <td className="text-center px-6 py-4 font-medium text-blue-700 dark:text-blue-300">{item.satuan}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {renderStats()}
        </div>
    );
});
