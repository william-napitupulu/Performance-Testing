import { Baseline } from '@/data/baselineData';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BaselineFilters } from './BaselineFilters';
import { BaselineTableHeader } from './BaselineTableHeader';
import { BaselineTableRow } from './BaselineTableRow';

interface BaselineTableProps {
    data: Baseline[];
    allData: Baseline[];
    onSort: (field: keyof Baseline) => void;
    sortField: keyof Baseline | null;
    sortDirection: 'asc' | 'desc' | null;
    deletingIds?: Set<number>;
    onDelete: (id: number) => void;
    onViewDetails: (baseline: Baseline) => void;
    onFilteredDataChange: (data: Baseline[]) => void;
}

export function BaselineTable({
    data,
    allData,
    onSort,
    sortField,
    sortDirection,
    deletingIds = new Set(),
    onDelete,
    onViewDetails,
    onFilteredDataChange,
}: BaselineTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, currentPage]);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startItem = data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, data.length);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="overflow-visible rounded-lg border border-border bg-card shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="relative overflow-x-auto">
                <table className="w-full divide-y divide-border dark:divide-gray-700 table-fixed">
                    <BaselineTableHeader onSort={onSort} sortField={sortField} sortDirection={sortDirection} />
                    <tbody className="divide-y divide-border dark:divide-gray-700">
                        <BaselineFilters allData={allData} onFilteredDataChange={onFilteredDataChange} />
                        {paginatedData.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No data found</td></tr>
                        ) : (
                            paginatedData.map((baseline) => (
                                <BaselineTableRow
                                    key={baseline.reff_id}
                                    baseline={baseline}
                                    isDeleting={deletingIds.has(baseline.reff_id)}
                                    onDelete={onDelete}
                                    onViewDetails={onViewDetails}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="border-t border-border bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
                            <span className="font-medium">{data.length}</span> records
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* First page */}
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </button>

                            {/* Previous page */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            {/* Page numbers */}
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`rounded-md border px-3 py-2 text-sm font-medium ${
                                        page === currentPage
                                            ? 'border-green-600 bg-green-600 text-white'
                                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next page */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>

                            {/* Last page */}
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
