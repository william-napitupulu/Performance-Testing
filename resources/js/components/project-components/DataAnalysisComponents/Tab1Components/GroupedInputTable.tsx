import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlertCircle } from 'lucide-react';

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
  tabId?: string; // Add tabId prop
}

export const GroupedInputTable: React.FC<GroupedInputTableProps> = React.memo(({
  jm,
  headers,
  tags,
  inputValues,
  onValueChange,
  getInputValue,
  sortConfig,
  onSort,
  filters,
  onFilterChange,
  tabId = 'default' // Default value if not provided
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 999999; // Show all items, effectively no pagination
  const [hoveredInput, setHoveredInput] = useState<string | null>(null);
  
  // Debug: Check for duplicates (can be removed after testing)
  const tagNumbers = tags.map(tag => tag.tag_no);
  const duplicates = tagNumbers.filter((item, index) => tagNumbers.indexOf(item) !== index);
  if (duplicates.length > 0) {
    console.log(`🔴 DUPLICATE TAGS DETECTED in tabId: ${tabId}, jm: ${jm}`, duplicates);
  }

  // Validation function
  const validateInput = (value: string): { isValid: boolean; error?: string } => {
    if (!value || value.trim() === '') {
      return { isValid: true }; // Empty is valid (optional)
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { isValid: false, error: 'Please enter a valid number' };
    }
    
    if (numValue < 0) {
      return { isValid: false, error: 'Value cannot be negative' };
    }
    
    if (numValue > 999999) {
      return { isValid: false, error: 'Value is too large (max: 999,999)' };
    }
    
    return { isValid: true };
  };

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
                    key={`header-${tabId}-${jm}-${i}`}
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
                  <td key={`filter-header-${tabId}-${jm}-${index}`} className="px-4 py-2 ">

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
                  const uniqueKey = `${tabId}-${jm}-row-${idx}-${safeTagNo}`;
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
                      {headers.map((_, timeIndex) => {
                        const inputValue = getInputValue(safeTagNo, timeIndex);
                        const validation = validateInput(inputValue);
                        const inputKey = `${safeTagNo}-${timeIndex}`;
                        const showTooltip = hoveredInput === inputKey && !validation.isValid;
                        
                        return (
                          <td key={`${uniqueKey}-${timeIndex}`} className="px-6 py-4 text-center relative">
                            <div className="relative">
                              <input
                                type="number"
                                step="any"
                                value={inputValue}
                                onChange={(e) => onValueChange(safeTagNo, timeIndex, e.target.value)}
                                onMouseEnter={() => setHoveredInput(inputKey)}
                                onMouseLeave={() => setHoveredInput(null)}
                                placeholder="0.00"
                                className={`w-28 px-3 py-2 text-sm border rounded bg-background text-foreground focus:outline-none focus:ring-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                  validation.isValid 
                                    ? 'border-input focus:ring-blue-500' 
                                    : 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20'
                                }`}
                              />
                              {!validation.isValid && (
                                <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                              )}
                              
                              {/* Validation Tooltip */}
                              {showTooltip && (
                                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs">
                                  <div className="bg-red-600 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                                    <div className="flex items-center gap-2">
                                      <AlertCircle className="h-3 w-3" />
                                      {validation.error}
                                    </div>
                                    {/* Arrow pointing down */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
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
                    key={`page-${tabId}-${jm}-${page}`}
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
}); 