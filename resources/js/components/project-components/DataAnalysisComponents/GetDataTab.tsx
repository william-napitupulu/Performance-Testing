import React, { useState } from 'react';
import { DataAnalysisStats } from './DataAnalysisStats';
import { DataAnalysisTable } from './DataAnalysisTable';
import type { AnalysisData, ApiResponse } from './types';
import { SaveButton } from './Tab1Components/SaveButton';
import { useManualInput } from './ManualInputContext';

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
}

interface GetDataTabProps {
  data: AnalysisData[];
  pagination: ApiResponse['pagination'];
  filters: ApiResponse['filters'];
  sort: ApiResponse['sort'];
  loading: boolean;
  onSubmit: (data: { description: string; dateTime: string }) => void;
  onDataUpdate: (params: {
    page?: number;
    sort_field?: string;
    sort_direction?: string;
    filter_tag_no?: string;
    filter_value?: string;
    filter_date?: string;
    perf_id?: number;
  }) => Promise<void>;
  sharedData: SharedPerformanceData;
}

export function GetDataTab({
  data,
  pagination,
  filters,
  sort,
  loading,
  onSubmit,
  onDataUpdate,
  sharedData
}: GetDataTabProps) {
  const { dataHook, actionsHook } = useManualInput();

  const handleSort = async (field: string) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    await onDataUpdate({
      sort_field: field,
      sort_direction: newDirection,
      page: 1
    });
  };

  const handlePageChange = async (page: number) => {
    await onDataUpdate({
      page: page
    });
  };

  const handleSaveManualInput = async () => {
    const success = await actionsHook.handleSaveData(dataHook.selectedPerformance, sharedData);
    if (success) {
      await onDataUpdate({
        page: pagination.current_page,
        sort_field: sort.field,
        sort_direction: sort.direction,
        filter_tag_no: filters.tag_no || undefined,
        filter_value: filters.value || undefined,
        filter_date: filters.date || undefined,
        perf_id: sharedData.perfId
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Test Info */}
      {!sharedData.dateTime ? (
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            ⚠️ No performance test selected. Please choose a performance from the Performance List or create a new one in the "New Performance Test" tab.
          </p>
        </div>
      ) : (
      <div className="bg-blue-50/70 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-800/50">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
          Performance Test Results
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Description:</span>
            <p className="text-gray-700 dark:text-gray-300">{sharedData.description}</p>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Date/Time:</span>
            <p className="text-gray-700 dark:text-gray-300">
              {new Date(sharedData.dateTime).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>
          </div>
          {sharedData.perfId && (
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Performance ID:</span>
              <p className="text-gray-700 dark:text-gray-300">{sharedData.perfId}</p>
            </div>
          )}
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Total Records:</span>
            <p className="text-gray-700 dark:text-gray-300">{pagination?.total || 0}</p>
          </div>
        </div>
        {/* Save Manual Input Data Button moved from Tab1 */}
        <SaveButton
          saving={actionsHook.saving}
          hasDataToSave={actionsHook.hasDataToSave()}
          onSave={handleSaveManualInput}
          showButton={dataHook.inputTags.length > 0}
        />
      </div>
      )}

      {/* Results */}
      {sharedData.dateTime && data.length > 0 && <DataAnalysisStats data={data} />}
      <DataAnalysisTable
        data={data}
        loading={loading}
        sort={sort}
        pagination={pagination}
        onSort={handleSort}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 