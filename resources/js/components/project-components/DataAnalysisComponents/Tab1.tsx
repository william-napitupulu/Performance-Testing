import React from 'react';
import { PerformanceInfo } from './Tab1Components/PerformanceInfo';
// import { PerformanceSelector } from './Tab1Components/PerformanceSelector';
import { GroupedInputTable } from './Tab1Components/GroupedInputTable';
// import { SaveButton } from './Tab1Components/SaveButton';
import { getFilteredAndSortedTags } from './Tab1Components/utils';
import { SharedPerformanceData } from './Tab1Components/types';
import { useManualInput } from './ManualInputContext';

interface Tab1Props {
  sharedData: SharedPerformanceData;
}

export function Tab1({ sharedData }: Tab1Props) {
  // Use shared manual input context
  const { dataHook, actionsHook } = useManualInput();

  return (
    <div className="p-6 bg-background rounded-b-lg border border-border dark:border-border/50">
      {/* Performance Test Info */}
      <PerformanceInfo sharedData={sharedData} />

      {/* Performance Test Selector */}
      {/**
       * PerformanceSelector (dropdown) is no longer needed because we arrive at Tab1
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

      {/* Grouped Input Tables */}
      {Object.keys(dataHook.groupedTags).map(jmKey => {
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

      {/**
       * Save button moved to GetDataTab. Keeping code for reference.
       * <SaveButton
       *   saving={actionsHook.saving}
       *   hasDataToSave={actionsHook.hasDataToSave()}
       *   onSave={() => actionsHook.handleSaveData(dataHook.selectedPerformance, sharedData)}
       *   showButton={dataHook.inputTags.length > 0}
       * />
       */}
    </div>
  );
} 