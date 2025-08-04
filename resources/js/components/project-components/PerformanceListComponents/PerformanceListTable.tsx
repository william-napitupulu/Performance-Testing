import { Performance } from '@/data/mockPerformanceData';
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
// import { useMemo, useState } from 'react';
// import { PerformanceListFilters } from './PerformanceListFilters';
import { PerformanceTableHeader } from './PerformanceTableHeader';
import { PerformanceTableRow } from './PerformanceTableRow';

interface PerformanceListTableProps {
    data: Performance[];
    // allData: Performance[];
    editingId: number | null;
    editForm: Partial<Performance>;
    showEditTooltip: boolean;
    editTooltipMessage: string;
    onEdit: (performance: Performance) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (id: number) => void;
    onEditFormChange: (field: keyof Performance, value: string | number) => void;
    onSort: (field: keyof Performance) => void;
    // onFilteredDataChange: (data: Performance[]) => void;
    sortField: keyof Performance | null;
    sortDirection: 'asc' | 'desc' | null;
    // deletingIds?: Set<number>;
}

export function PerformanceListTable({
    data,
    // allData,
    editingId,
    editForm,
    showEditTooltip,
    editTooltipMessage,
    onEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    onEditFormChange,
    onSort,
    // onFilteredDataChange,
    sortField,
    sortDirection,
    // deletingIds = new Set(),
}: PerformanceListTableProps) {
    // const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;

    // // Paginate the data
    // const paginatedData = useMemo(() => {
    //     const startIndex = (currentPage - 1) * itemsPerPage;
    //     const endIndex = startIndex + itemsPerPage;
    //     return data.slice(startIndex, endIndex);
    // }, [data, currentPage, itemsPerPage]);

    // const totalPages = Math.ceil(data.length / itemsPerPage);
    // const startItem = data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    // const endItem = Math.min(currentPage * itemsPerPage, data.length);

    // const handlePageChange = (page: number) => {
    //     setCurrentPage(page);
    // };

    // const getPageNumbers = () => {
    //     const pages = [];
    //     const maxVisiblePages = 5;

    //     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    //     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    //     // Adjust start page if we're near the end
    //     if (endPage - startPage + 1 < maxVisiblePages) {
    //         startPage = Math.max(1, endPage - maxVisiblePages + 1);
    //     }

    //     for (let i = startPage; i <= endPage; i++) {
    //         pages.push(i);
    //     }

    //     return pages;
    // };

    return (
        <div className="overflow-visible rounded-lg border border-border bg-card shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="relative overflow-x-auto" style={{ overflowY: 'visible' }}>
                <table className="min-w-full divide-y divide-border dark:divide-gray-700">
                    <PerformanceTableHeader onSort={onSort} sortField={sortField} sortDirection={sortDirection || 'asc'} />
                    <tbody className="divide-y divide-border dark:divide-gray-700">
                        {/* <PerformanceListFilters performances={allData} onFilteredDataChange={onFilteredDataChange} /> */}
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            data.map((performance) => (
                                <PerformanceTableRow
                                    key={performance.id}
                                    performance={performance}
                                    isEditing={editingId === performance.id}
                                    editForm={editForm}
                                    showEditTooltip={showEditTooltip && editingId === performance.id}
                                    editTooltipMessage={editTooltipMessage}
                                    onEdit={onEdit}
                                    onSaveEdit={onSaveEdit}
                                    onCancelEdit={onCancelEdit}
                                    onDelete={onDelete}
                                    onEditFormChange={onEditFormChange}
                                    isDeleting={false}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
