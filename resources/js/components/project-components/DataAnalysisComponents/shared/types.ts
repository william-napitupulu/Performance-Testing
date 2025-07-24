// Shared types for DataAnalysis Tab components
export interface SharedPerformanceData {
    description: string;
    dateTime: string;
    perfId?: number;
    tabCount?: number;
}

export interface InputTag {
    tag_no: string;
    description: string;
    unit_name: string;
    jm_input: number;
    group_id: number;
    urutan: number;
    m_input: number;
}

export interface ExistingInput {
    tag_no: string;
    value: number;
    date_rec: string;
}

export interface InputTagsData {
    input_tags: InputTag[];
    existing_inputs: Record<string, ExistingInput>;
}

export interface BaseTabProps {
    sharedData: SharedPerformanceData;
    inputTagsData?: InputTagsData;
}

export interface BaseTabContextType {
    dataHook: any; // Will be properly typed based on the actual hook return type
    actionsHook: any; // Will be properly typed based on the actual hook return type
    mInput: number;
}

export interface BaseTabProviderProps {
    sharedData: SharedPerformanceData;
    children: React.ReactNode;
    onDataSaved?: () => Promise<void>;
    inputTagsData?: InputTagsData;
    mInput: number;
}

export interface TabConfig {
    id: number;
    mInput: number;
    label: string;
    component: React.ComponentType<BaseTabProps>;
    provider: React.ComponentType<BaseTabProviderProps>;
}

// Re-export types that are used in multiple places
export type {
    ExistingInput as ExistingInputType,
    InputTag as InputTagType,
    InputTagsData as InputTagsDataType,
    SharedPerformanceData as PerformanceData,
};
