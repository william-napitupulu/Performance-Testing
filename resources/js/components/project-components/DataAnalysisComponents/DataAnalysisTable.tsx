import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { AnalysisData, ApiResponse } from './types';
import { DataAnalysisFilters } from './DataAnalysisFilters';

interface DataAnalysisTableProps {
  data: AnalysisData[];
  loading: boolean;
  sort: ApiResponse['sort'];
  pagination: ApiResponse['pagination'];
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: any) => void;
}

export const DataAnalysisTable = React.memo(function DataAnalysisTable({ 
  data, 
  loading, 
  sort, 
  pagination, 
  onSort, 
  onPageChange,
  onFilterChange
}: DataAnalysisTableProps) {
  const handleSort = (field: string) => {
    onSort(field);
  };

  const renderSortIcon = (field: string) => {
    const iconBaseClasses = "h-3.5 w-3.5 ml-1.5 transition-colors";
    const iconColor = getHeaderColor(field);
    
    if (sort.field !== field) {
      return <ArrowUpDown className={`${iconBaseClasses} ${iconColor}`} />;
    }
    return (
      <ArrowUpDown 
        className={`${iconBaseClasses} ${iconColor} ${
          sort.direction === 'desc' ? 'rotate-180' : ''
        }`}
      />
    );
  };

  const getHeaderColor = (field: string) => {
    switch (field) {
      case 'no':
        return 'text-indigo-700 dark:text-indigo-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'tag_no':
        return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'description':
        return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'value':
        return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'min':
        return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'max':
        return 'text-orange-700 dark:text-orange-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'average':
        return 'text-purple-700 dark:text-purple-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'date_rec':
        return 'text-violet-700 dark:text-violet-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      default:
        return 'text-gray-600 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300';
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return dateString;
    }
  };

  const headerBaseClasses = "group py-2.5 text-[11px] font-medium uppercase tracking-wider select-none cursor-pointer hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors";

  const getPageNumbers = () => {
    if (!pagination) return [];
    
    const { current_page, last_page } = pagination;
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(last_page, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const renderPagination = () => {
    if (!pagination || pagination.total === 0) return null;

    const { current_page, last_page, from, to, total } = pagination;
    
    return (
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-border dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            {/* First page */}
            <button
              onClick={() => onPageChange(1)}
              disabled={Number(current_page) === 1}
              title="Go to first page"
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            
            {/* Previous page */}
            <button
              onClick={() => {
                const prevPage = Math.max(1, Number(current_page) - 1);
                onPageChange(prevPage);
              }}
              disabled={Number(current_page) === 1}
              title="Go to previous page"
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Page numbers */}
            {getPageNumbers().map((page) => {
              const isActive = Number(page) === Number(current_page);
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  title={`Go to page ${page}`}
                  className={`px-3 py-2 rounded-md border text-sm font-medium ${
                    isActive
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            {/* Next page */}
            <button
              onClick={() => {
                const currentPageNum = Number(current_page);
                const lastPageNum = Number(last_page);
                const nextPage = Math.min(lastPageNum, currentPageNum + 1);
                onPageChange(nextPage);
              }}
              disabled={Number(current_page) === Number(last_page)}
              title="Go to next page"
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Last page */}
            <button
              onClick={() => onPageChange(Number(last_page))}
              disabled={Number(current_page) === Number(last_page)}
              title="Go to last page"
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
      <div className="px-6 py-4 bg-blue-50/70 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800/50">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Input Data Results</h3>
        <div className="text-sm text-blue-600 dark:text-blue-400">
          Total Records: {pagination?.total || 0}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
          <thead className="bg-blue-50/70 dark:bg-gray-800/70 border-y border-blue-100 dark:border-gray-700">
            <tr>
              <th className={`${headerBaseClasses} px-4 text-center text-indigo-700 dark:text-indigo-300`}>
                <div className="flex items-center justify-center">
                  No
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 ${getHeaderColor('tag_no')}`} onClick={() => handleSort('tag_no')}>
                <div className="flex items-center">
                  Tag No {renderSortIcon('tag_no')}
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 ${getHeaderColor('description')}`} onClick={() => handleSort('description')}>
                <div className="flex items-center">
                  Description {renderSortIcon('description')}
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 text-center ${getHeaderColor('min')}`} onClick={() => handleSort('min')}>
                <div className="flex items-center justify-center">
                  Min {renderSortIcon('min')}
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 text-center ${getHeaderColor('max')}`} onClick={() => handleSort('max')}>
                <div className="flex items-center justify-center">
                  Max {renderSortIcon('max')}
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 text-center ${getHeaderColor('average')}`} onClick={() => handleSort('average')}>
                <div className="flex items-center justify-center">
                  Average {renderSortIcon('average')}
                </div>
              </th>
            </tr>
            <DataAnalysisFilters onFilterChange={onFilterChange} />
          </thead>
          <tbody className="divide-y divide-blue-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-2"></div>
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
                <tr 
                  key={item.id || `data-row-${index}`} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                      {item.no}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-700 dark:text-blue-300 font-medium">
                    {item.tag_no}
                  </td>
                  <td className="px-6 py-4 text-blue-700 dark:text-blue-300 font-medium">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-emerald-700 dark:text-emerald-300">
                    {typeof item.min === 'number' ? item.min.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : (item.min || 'N/A')}
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-orange-700 dark:text-orange-300">
                    {typeof item.max === 'number' ? item.max.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : (item.max || 'N/A')}
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-purple-700 dark:text-purple-300">
                    {typeof item.average === 'number' ? item.average.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : (item.average || 'N/A')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
}); 