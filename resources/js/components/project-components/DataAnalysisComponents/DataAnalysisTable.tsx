import React from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AnalysisData, ApiResponse } from './types';

interface DataAnalysisTableProps {
  data: AnalysisData[];
  loading: boolean;
  sort: ApiResponse['sort'];
  pagination: ApiResponse['pagination'];
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
}

export function DataAnalysisTable({ 
  data, 
  loading, 
  sort, 
  pagination, 
  onSort, 
  onPageChange 
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
      case 'value':
        return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
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

  const renderPagination = () => {
    if (!pagination || pagination.total === 0) return null;

    const { current_page, last_page, from, to, total } = pagination;
    
    return (
      <div className="bg-blue-50/70 dark:bg-gray-800/70 px-6 py-3 border-t border-blue-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Showing {from} to {to} of {total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(current_page - 1)}
              disabled={current_page <= 1}
              className={`
                inline-flex items-center px-2 py-1 text-sm font-medium rounded
                ${current_page <= 1 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                }
              `}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, last_page) }, (_, i) => {
                const page = i + 1;
                const isActive = page === current_page;
                
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`
                      px-3 py-1 text-sm font-medium rounded
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(current_page + 1)}
              disabled={current_page >= last_page}
              className={`
                inline-flex items-center px-2 py-1 text-sm font-medium rounded
                ${current_page >= last_page 
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                }
              `}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
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
              <th className={`${headerBaseClasses} px-4 text-center ${getHeaderColor('no')}`} onClick={() => handleSort('no')}>
                <div className="flex items-center justify-center">
                  No {renderSortIcon('no')}
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 ${getHeaderColor('tag_no')}`} onClick={() => handleSort('tag_no')}>
                <div className="flex items-center">
                  Tag No {renderSortIcon('tag_no')}
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 text-center ${getHeaderColor('value')}`} onClick={() => handleSort('value')}>
                <div className="flex items-center justify-center">
                  Value {renderSortIcon('value')}
                </div>
              </th>
              <th className={`${headerBaseClasses} px-6 text-center ${getHeaderColor('date_rec')}`} onClick={() => handleSort('date_rec')}>
                <div className="flex items-center justify-center">
                  Date Recorded {renderSortIcon('date_rec')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-2"></div>
                    <span className="text-blue-600 dark:text-blue-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr 
                  key={item.id} 
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
                  <td className="px-6 py-4 text-center font-mono text-emerald-700 dark:text-emerald-300">
                    {typeof item.value === 'number' ? item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : item.value}
                </td>
                  <td className="px-6 py-4 text-center text-violet-700 dark:text-violet-300">
                    {formatDateTime(item.date_rec)}
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
} 