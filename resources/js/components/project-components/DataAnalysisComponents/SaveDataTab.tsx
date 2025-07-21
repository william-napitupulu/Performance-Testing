import React, { useCallback } from 'react';
import { DataAnalysisTable } from './DataAnalysisTable';
import { AlertTriangle, BarChart3, Calendar, Hash, FileText, Database } from 'lucide-react';
import type { AnalysisData, ApiResponse } from './types';

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
}

interface SaveDataTabProps {
  data: AnalysisData[];
  pagination: ApiResponse['pagination'];
  filters: ApiResponse['filters'];
  sort: ApiResponse['sort'];
  loading: boolean;
  onDataUpdate: (params: {
    page?: number;
    sort_field?: string;
    sort_direction?: string;
    filter_tag_no?: string;
    filter_description?: string;
    filter_value_min?: string;
    filter_value_max?: string;
    filter_min_from?: string;
    filter_min_to?: string;
    filter_max_from?: string;
    filter_max_to?: string;
    filter_average_from?: string;
    filter_average_to?: string;
    filter_date?: string;
    perf_id?: number;
  }) => Promise<void>;
  sharedData: SharedPerformanceData;
}

/**
 * Prepares filter parameters by prefixing keys with "filter_"
 * and removing null/undefined/empty values.
 */
const prepareFilterParams = (filters: ApiResponse['filters']) => {
  const params: Record<string, any> = {};
  for (const key in filters) {
    const filterKey = key as keyof ApiResponse['filters'];
    if (filters[filterKey] !== null && filters[filterKey] !== undefined && filters[filterKey] !== '') {
      params[`filter_${filterKey}`] = filters[filterKey];
    }
  }
  return params;
};

export const SaveDataTab = React.memo(function SaveDataTab({
  data,
  pagination,
  filters,
  sort,
  loading,
  onDataUpdate,
  sharedData
}: SaveDataTabProps) {
  const handleSort = useCallback(async (field: string) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    await onDataUpdate({
      ...prepareFilterParams(filters),
      sort_field: field,
      sort_direction: newDirection,
      // COMMENTED OUT: No longer using pagination
      // page: 1, // Reset to first page when sorting
      perf_id: sharedData.perfId
    });
  }, [sort, filters, sharedData.perfId]);

  // COMMENTED OUT: Page change handler - no longer using pagination
  // const handlePageChange = useCallback(async (page: number) => {
  //   await onDataUpdate({
  //     ...prepareFilterParams(filters),
  //     sort_field: sort.field,
  //     sort_direction: sort.direction,
  //     page: page,
  //     perf_id: sharedData.perfId
  //   });
  // }, [sort, filters, sharedData.perfId]);

  const handleFilterChange = useCallback(async (filterParams: any) => {
    await onDataUpdate({
      ...filterParams,
      sort_field: sort.field,
      sort_direction: sort.direction,
      // COMMENTED OUT: No longer using pagination
      // page: 1, // Reset to first page when filtering
      perf_id: sharedData.perfId
    });
  }, [sort, sharedData.perfId]);

  return (
    <div className="space-y-6">
      {/* Warning when no performance selected */}
      {!sharedData.dateTime ? (
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-4 border-orange-500 dark:border-orange-400">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                No Performance Test Selected
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Please choose a performance from the Performance List or create a new one to begin your analysis.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden rounded-b-lg">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-b-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Performance Analysis Results
                </h2>
                <p className="text-blue-100 text-sm">
                  Detailed analysis data and performance metrics
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Test Description
                </h3>
                <p className="text-gray-900 dark:text-gray-100 text-base leading-relaxed">
                  {sharedData.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date/Time */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                        Date & Time
                      </h4>
                      <p className="text-purple-900 dark:text-purple-100 font-medium">
                        {new Date(sharedData.dateTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        {new Date(sharedData.dateTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance ID */}
                {sharedData.perfId && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                          Performance ID
                        </h4>
                        <p className="text-blue-900 dark:text-blue-100 font-mono text-sm font-semibold">
                          {sharedData.perfId}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Records */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                        <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                        Total Records
                      </h4>
                      <p className="text-amber-900 dark:text-amber-100 font-bold text-lg">
                        {pagination?.total || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results - Only show when performance test is selected */}
      {sharedData.dateTime && (
        <DataAnalysisTable
          data={data}
          loading={loading}
          sort={sort}
          pagination={pagination}
          onSort={handleSort}
          // COMMENTED OUT: No longer using pagination - onPageChange prop is now optional
          // onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
}); 