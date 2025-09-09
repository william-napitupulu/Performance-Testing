import React from 'react';
import { NoDataWarning } from './shared/NoDataWarning';
import { useUniversalTabContext } from './shared/UniversalTabContext';
import { GroupedInputTable } from './Tab1Components/GroupedInputTable';
import { PerformanceInfo } from './Tab1Components/PerformanceInfo';
import { SaveButton } from './Tab1Components/SaveButton';
import type { SharedPerformanceData } from './Tab1Components/types';
import { getFilteredAndSortedTags } from './Tab1Components/utils';

interface UnifiedTabTemplateProps {
    tabNumber: number;
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
        existing_inputs: Record<
            string,
            {
                tag_no: string;
                value: number | null;
                date_rec: string;
            }
        >;
    };
    onDataSaved?: () => void;
}

export const UnifiedTabTemplate: React.FC<UnifiedTabTemplateProps> = ({ tabNumber, sharedData }) => {
    // Use the universal tab context
    const { dataHook, actionsHook } = useUniversalTabContext();

    // Generate unique tab identifier including performance ID
    const tabId = `unified-tab-${tabNumber}-perf-${sharedData.perfId || 'no-perf'}`;

    return (
        <div className="rounded-b-lg border border-border bg-background p-6 dark:border-border/50">
            {/* Performance Test Info */}
            <PerformanceInfo sharedData={sharedData} />

            {/* No Data Found Message */}
            <NoDataWarning
                mInput={tabNumber}
                isVisible={dataHook.noDataFound}
                customMessage={`No input tags found for Tab ${tabNumber} (m_input = ${tabNumber}). There may be no data available for this configuration.`}
            />

            {/* Grouped Input Tables */}
            {Object.keys(dataHook.groupedTags).map((jmKey) => {
                const jm = parseInt(jmKey, 10);
                const allTags = dataHook.groupedTags[jm];
                const headers = dataHook.groupedHeaders[jm] || [];
                const sortConfig = dataHook.sortConfigByJm[jm] || { field: 'tag_no', direction: 'asc' };
                const filters = dataHook.filtersByJm[jm] || { tag_no: '', description: '', unit_name: '' };
                const filteredTags = getFilteredAndSortedTags(jm, allTags, filters, sortConfig);

                return (
                    <GroupedInputTable
                        key={`${tabId}-jm-${jm}`}
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
                        tabId={tabId}
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
};
