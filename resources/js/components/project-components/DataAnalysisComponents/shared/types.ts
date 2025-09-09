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

// ✅ DEFINED: Specific types for sort and filter configurations
export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

export interface FilterConfig {
    tag_no: string;
    description: string;
    unit_name: string;
}

// ✅ DEFINED: The shape of the object returned by your data hook
export interface DataHookReturnType {
    groupedTags: Record<number, InputTag[]>;
    groupedHeaders: Record<number, string[]>;
    sortConfigByJm: Record<number, SortConfig>;
    filtersByJm: Record<number, FilterConfig>;
    inputValuesByJm: Record<number, Record<string, string>>;
    noDataFound: boolean;
    inputTags: InputTag[];
    selectedPerformance: SharedPerformanceData | null;
}

// ✅ DEFINED: The shape of the object returned by your actions hook
export interface ActionsHookReturnType {
    handleInputChange: (jm: number, tagNo: string, timeIndex: number, value: string) => void;
    getInputValue: (jm: number, tagNo: string, timeIndex: number) => string;
    handleSort: (jm: number, field: string) => void;
    handleFilterChange: (jm: number, field: keyof FilterConfig, value: string) => void;
    saving: boolean;
    hasDataToSave: () => boolean;
    handleSaveData: (performance: SharedPerformanceData | null, sharedData: SharedPerformanceData) => Promise<void>;
}

export interface BaseTabContextType {
    // ✅ RESOLVED: Replaced 'any' with specific hook return types
    dataHook: DataHookReturnType;
    actionsHook: ActionsHookReturnType;
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
