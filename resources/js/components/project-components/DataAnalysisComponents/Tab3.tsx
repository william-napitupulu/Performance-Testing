import React from 'react';
import { PerformanceInfo } from './Tab1Components/PerformanceInfo';
// import { PerformanceSelector } from './Tab1Components/PerformanceSelector';
import { GroupedInputTable } from './Tab1Components/GroupedInputTable';
import { SaveButton } from './Tab1Components/SaveButton';
import { getFilteredAndSortedTags } from './Tab1Components/utils';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab3Context } from './Tab3Context';

interface Tab3Props {
  sharedData: SharedPerformanceData;
  inputTagsData?: {
    input_tags: Array<{
      tag_no: string;
      description: string;
      unit_name: string;
      jm_input: number;
      group_id: number;
      urutan: number;
      m_input: number;
    }>;
    existing_inputs: Record<string, {
      tag_no: string;
      value: number;
      date_rec: string;
    }>;
  };
}

export function Tab3({ sharedData, inputTagsData }: Tab3Props) {
  // Use Tab3 specific context
  const { dataHook, actionsHook } = useTab3Context();

  return (
    <div className="p-6 bg-background rounded-b-lg border border-border dark:border-border/50">
      {/* Header Section */}
      <div className="bg-purple-50/70 dark:bg-purple-900/10 rounded-lg p-6 border border-purple-100 dark:border-purple-800/50 mb-6">
        <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
          Tab 3 - Manual Input (m_input = 3)
        </h2>

      </div>

      {/* Performance Test Info */}
      <PerformanceInfo sharedData={sharedData} />

      {/* Performance Test Selector */}
      {/**
       * PerformanceSelector (dropdown) is no longer needed because we arrive at Tab3
       * via the Performance List → Get Data flow which already locks onto a
       * specific performance.  Keeping the component reference commented for
       * potential future use.
       *
       * <PerformanceSelector
       *   performanceRecords={dataHook.performanceRecords}
       *   selectedPerfId={dataHook.selectedPerformance?.perf_id ?? null}
       *   onSelect={(perfId) => {
       *     const fakeEvent = { target: { value: String(perfId) } } as unknown as React.ChangeEvent<HTMLSelectElement>;
       *     dataHook.handlePerformanceSelect(fakeEvent);
       *   }}
       * />
       */}

      {/* Loading State */}
      {dataHook.loading && !dataHook.loadingTimeout && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Loading input tags for Tab 3 (m_input = 3)...
            </p>
          </div>
        </div>
      )}

      {/* Request Timeout Message */}
      {!dataHook.loading && dataHook.loadingTimeout && dataHook.noDataFound && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-800 dark:text-red-300">
              ⏰ Request timed out after 10 seconds. Unable to load input tags for Tab 3 (m_input = 3).
            </p>
            <button
              onClick={() => dataHook.fetchInputTags(sharedData.dateTime, sharedData.perfId)}
              className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* No Data Found Message (not timeout) */}
      {!dataHook.loading && !dataHook.loadingTimeout && dataHook.noDataFound && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-orange-800 dark:text-orange-300">
              ⚠️ No input tags found for Tab 3 (m_input = 3). There may be no data available for this configuration.
            </p>
            <button
              onClick={() => dataHook.fetchInputTags(sharedData.dateTime, sharedData.perfId)}
              className="ml-4 px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Grouped Input Tables */}
      {!dataHook.loading && Object.keys(dataHook.groupedTags).map(jmKey => {
        const jm = parseInt(jmKey, 10);
        const allTags = dataHook.groupedTags[jm];
        const headers = dataHook.groupedHeaders[jm] || [];
        const sortConfig = dataHook.sortConfigByJm[jm] || { field: 'tag_no', direction: 'asc' };
        const filters = dataHook.filtersByJm[jm] || { tag_no: '', description: '', unit_name: '' };
        const filteredTags = getFilteredAndSortedTags(jm, allTags, filters, sortConfig);
        
        return (
          <GroupedInputTable
            key={jm}
            jm={jm}
            headers={headers}
            tags={filteredTags}
            inputValues={dataHook.inputValuesByJm[jm] || {}}
            onValueChange={(tagNo, timeIndex, value) => actionsHook.handleInputChange(jm, tagNo, timeIndex, value)}
            getInputValue={(tagNo, timeIndex) => actionsHook.getInputValue(jm, tagNo, timeIndex)}
            sortConfig={sortConfig}
            onSort={(field) => actionsHook.handleSort(jm, field)}
            filters={filters}
            onFilterChange={(field, value) => actionsHook.handleFilterChange(jm, field, value)}
          />
        );
      })}

      {/* Save Button */}
      {!dataHook.loading && (
        <div className="mt-6 flex justify-end">
          <SaveButton
            saving={actionsHook.saving}
            hasDataToSave={actionsHook.hasDataToSave()}
            onSave={() => actionsHook.handleSaveData(dataHook.selectedPerformance, sharedData)}
            showButton={dataHook.inputTags.length > 0}
          />
        </div>
      )}
    </div>
  );
} 