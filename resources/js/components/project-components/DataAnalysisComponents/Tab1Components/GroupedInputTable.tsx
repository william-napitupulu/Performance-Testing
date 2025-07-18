import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface InputTag {
  tag_no: string;
  description: string;
  unit_name: string;
  jm_input: number;
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  tag_no: string;
  description: string;
  unit_name: string;
}

interface GroupedInputTableProps {
  jm: number;
  headers: string[];
  tags: InputTag[];
  inputValues: { [key: string]: string };
  onValueChange: (tagNo: string, timeIndex: number, value: string) => void;
  getInputValue: (tagNo: string, timeIndex: number) => string;
  sortConfig: SortConfig;
  onSort: (field: string) => void;
  filters: FilterConfig;
  onFilterChange: (field: keyof FilterConfig, value: string) => void;
}

export const GroupedInputTable: React.FC<GroupedInputTableProps> = ({
  jm,
  headers,
  tags,
  inputValues,
  onValueChange,
  getInputValue,
  sortConfig,
  onSort,
  filters,
  onFilterChange
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Paginate the tags
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tags.slice(startIndex, endIndex);
  }, [tags, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(tags.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, tags.length);

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

  const headerBaseClasses = 'group py-2.5 text-[11px] font-medium uppercase tracking-wider select-none cursor-pointer hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors';

  const getHeaderColor = (field: string) => {
    switch (field) {
      case 'tag_no':
        return 'text-blue-700 dark:text-blue-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'description':
        return 'text-emerald-700 dark:text-emerald-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      case 'unit_name':
        return 'text-violet-700 dark:text-violet-300 group-hover:text-green-700 dark:group-hover:text-green-300';
      default:
        return 'text-gray-600 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-300';
    }
  };

  const renderSortIcon = (field: string) => {
    const base = 'h-3.5 w-3.5 ml-1.5 transition-colors';
    const color = getHeaderColor(field);
    if (sortConfig.field !== field) return <ArrowUpDown className={`${base} ${color}`} />;
    return (
      <ArrowUpDown
        className={`${base} ${color} ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
      />
    );
  };

  return (
    <div className="mb-8">
      <div className="rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
        <div className="px-6 py-4 bg-blue-50/70 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-800/50">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            Manual Input - {jm} 
          </h3>
          <div className="text-sm text-blue-600 dark:text-blue-400">Total Tags: {tags.length}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-100 dark:divide-gray-700">
            <thead className="bg-blue-50/70 dark:bg-gray-800/70 border-y border-blue-100 dark:border-gray-700">
              <tr>
                <th
                  className={`${headerBaseClasses} px-6 ${getHeaderColor('tag_no')}`}
                  onClick={() => onSort('tag_no')}
                >
                  <div className="flex items-center">Tag No {renderSortIcon('tag_no')}</div>
                </th>
                <th
                  className={`${headerBaseClasses} px-6 ${getHeaderColor('description')}`}
                  onClick={() => onSort('description')}
                >
                  <div className="flex items-center">Description {renderSortIcon('description')}</div>
                </th>
                <th
                  className={`${headerBaseClasses} px-6 ${getHeaderColor('unit_name')}`}
                  onClick={() => onSort('unit_name')}
                >
                  <div className="flex items-center">Unit {renderSortIcon('unit_name')}</div>
                </th>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="py-3 px-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
              {/* Filter Row */}
              <tr className="bg-blue-50/30 dark:bg-blue-900/10">
                <td className="px-6 py-2">
                  <input
                    type="text"
                    placeholder="Search Tag No..."
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    value={filters.tag_no}
                    onChange={(e) => onFilterChange('tag_no', e.target.value)}
                  />
                </td>
                <td className="px-6 py-2">
                  <input
                    type="text"
                    placeholder="Search Description..."
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    value={filters.description}
                    onChange={(e) => onFilterChange('description', e.target.value)}
                  />
                </td>
                <td className="px-6 py-2">
                  <input
                    type="text"
                    placeholder="Search Unit..."
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    value={filters.unit_name}
                    onChange={(e) => onFilterChange('unit_name', e.target.value)}
                  />
                </td>
                {headers.map((_, index) => (
                  <td key={`filter-header-${index}`} className="px-4 py-2 ">

                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-100 dark:divide-gray-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + headers.length}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No tags found matching the current filters
                  </td>
                </tr>
              ) : (
                paginatedData.map((tag, idx) => {
                  const safeTagNo = tag?.tag_no || `empty-tag-${idx}`;
                  const uniqueKey = `${jm}-tag-${idx}-${safeTagNo}`;
                  return (
                    <tr
                      key={uniqueKey}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-blue-700 dark:text-blue-300 font-medium">
                        {tag.tag_no}
                      </td>
                      <td className="px-6 py-4 text-emerald-700 dark:text-emerald-300">
                        {tag.description}
                      </td>
                      <td className="px-6 py-4 text-violet-700 dark:text-violet-300">
                        {tag.unit_name}
                      </td>
                      {headers.map((_, timeIndex) => (
                        <td key={`${uniqueKey}-${timeIndex}`} className="px-6 py-4 text-center">
                          <input
                            type="number"
                            step="any"
                            value={getInputValue(safeTagNo, timeIndex)}
                            onChange={(e) => onValueChange(safeTagNo, timeIndex, e.target.value)}
                            placeholder="0.00"
                            className="w-28 px-3 py-2 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-border dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{tags.length}</span> records
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
    </div>
  );
}; 