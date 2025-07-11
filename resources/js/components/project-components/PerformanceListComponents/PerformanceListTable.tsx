import { Performance } from '@/data/mockPerformanceData';
import { PerformanceTableHeader } from './PerformanceTableHeader';
import { PerformanceTableRow } from './PerformanceTableRow';
import { PerformanceListFilters } from './PerformanceListFilters';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PerformanceListTableProps {
  data: Performance[];
  allData: Performance[];
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
  onFilteredDataChange: (data: Performance[]) => void;
  sortField: keyof Performance | null;
  sortDirection: 'asc' | 'desc' | null;
}

export function PerformanceListTable({
  data,
  allData,
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
  onFilteredDataChange,
  sortField,
  sortDirection
}: PerformanceListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Paginate the data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

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
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
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
    <div className="rounded-lg shadow-lg overflow-visible bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
      <div className="relative overflow-x-auto" style={{ overflowY: 'visible' }}>
        <table className="min-w-full divide-y divide-border dark:divide-gray-700">
          <PerformanceTableHeader 
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection || 'asc'}
          />
          <tbody className="divide-y divide-border dark:divide-gray-700">
            <PerformanceListFilters
              performances={allData}
              onFilteredDataChange={onFilteredDataChange}
            />
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((performance) => (
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
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-border dark:border-gray-600">
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
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              
              {/* Previous page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Page numbers */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium ${
                    page === currentPage
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* Next page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Last page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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