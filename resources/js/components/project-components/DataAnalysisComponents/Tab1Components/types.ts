export interface InputTag {
    tag_no: string;
    description: string;
    unit_name: string;
    jm_input: number;
}

export interface SharedPerformanceData {
    description: string;
    dateTime: string;
    perfId?: number;
}

export interface PerformanceRecord {
    perf_id: number;
    description: string;
    date_perfomance: string;
    date_created: string;
    status: string;
    unit_id: number;
    unit_name: string;
    formatted_label: string;
}

export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

export interface FilterConfig {
    tag_no: string;
    description: string;
    unit_name: string;
}

export interface TimeSlot {
    headers: string[];
    slots: Date[];
}
