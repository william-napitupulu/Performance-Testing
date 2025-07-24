import React, { createContext, useContext } from 'react';
import { useTab1Actions } from '../Tab1Components/hooks/useTab1Actions';
import { useTab1Data } from '../Tab1Components/hooks/useTab1Data';
import { SharedPerformanceData } from '../Tab1Components/types';
import { UnifiedTabTemplate } from '../UnifiedTabTemplate';

export interface UniversalTabContextType {
    dataHook: ReturnType<typeof useTab1Data>;
    actionsHook: ReturnType<typeof useTab1Actions>;
    mInput: number;
}

const UniversalTabContext = createContext<UniversalTabContextType | undefined>(undefined);

interface UniversalTabProviderProps {
    sharedData: SharedPerformanceData;
    children: React.ReactNode;
    onDataSaved?: () => Promise<void>;
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
                value: number;
                date_rec: string;
            }
        >;
    };
    mInput: number;
}

export const UniversalTabProvider: React.FC<UniversalTabProviderProps> = ({ sharedData, children, onDataSaved, inputTagsData, mInput }) => {
    const dataHook = useTab1Data(sharedData, mInput, inputTagsData);
    const actionsHook = useTab1Actions({
        inputValuesByJm: dataHook.inputValuesByJm,
        setInputValuesByJm: dataHook.setInputValuesByJm,
        sortConfigByJm: dataHook.sortConfigByJm,
        setSortConfigByJm: dataHook.setSortConfigByJm,
        filtersByJm: dataHook.filtersByJm,
        setFiltersByJm: dataHook.setFiltersByJm,
        inputTags: dataHook.inputTags,
        groupedTags: dataHook.groupedTags,
        groupedSlots: dataHook.groupedSlots,
        dateTime: dataHook.dateTime,
        fetchInputTags: dataHook.fetchInputTags,
        onDataSaved: onDataSaved,
    });

    return <UniversalTabContext.Provider value={{ dataHook, actionsHook, mInput }}>{children}</UniversalTabContext.Provider>;
};

export const useUniversalTabContext = () => {
    const context = useContext(UniversalTabContext);
    if (context === undefined) {
        throw new Error('useUniversalTabContext must be used within a UniversalTabProvider');
    }
    return context;
};

// Factory function to create a context-wrapped component
export const createUniversalTabComponent = (tabNumber: number) => {
    return React.memo(function UniversalTabComponent(props: {
        sharedData: SharedPerformanceData;
        inputTagsData?: any;
        onDataSaved?: () => Promise<void>;
    }) {
        return (
            <UniversalTabProvider
                sharedData={props.sharedData}
                inputTagsData={props.inputTagsData}
                onDataSaved={props.onDataSaved}
                mInput={tabNumber}
            >
                <UnifiedTabTemplate
                    tabNumber={tabNumber}
                    sharedData={props.sharedData}
                    inputTagsData={props.inputTagsData}
                    onDataSaved={props.onDataSaved}
                />
            </UniversalTabProvider>
        );
    });
};

// Template component imported at the top
