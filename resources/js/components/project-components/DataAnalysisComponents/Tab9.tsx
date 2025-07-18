import React from 'react';
import { PerformanceInfo } from './Tab1Components/PerformanceInfo';
import { GroupedInputTable } from './Tab1Components/GroupedInputTable';
import { SaveButton } from './Tab1Components/SaveButton';
import { getFilteredAndSortedTags } from './Tab1Components/utils';
import { SharedPerformanceData } from './Tab1Components/types';
import { useTab9Context } from './Tab9Context';

interface Tab9Props {
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

export function Tab9({ sharedData, inputTagsData }: Tab9Props) {
  // Use Tab9 specific context
  const { dataHook, actionsHook } = useTab9Context();

  return (
    <div className="p-6 bg-background rounded-b-lg border border-border dark:border-border/50">


      {/* Performance Test Info */}
      <PerformanceInfo sharedData={sharedData} />

      {/* No Data Found Message */}
      {dataHook.noDataFound && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700/50">
          <p className="text-sm text-orange-800 dark:text-orange-300">
            ⚠️ No input tags found for Tab 9 (m_input = 9). There may be no data available for this configuration.
          </p>
        </div>
      )}

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

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <SaveButton
          saving={actionsHook.saving}
          hasDataToSave={actionsHook.hasDataToSave()}
          onSave={() => actionsHook.handleSaveData(dataHook.selectedPerformance, sharedData)}
          showButton={dataHook.inputTags.length > 0}
        />
      </div>
    </div>
  );
} 