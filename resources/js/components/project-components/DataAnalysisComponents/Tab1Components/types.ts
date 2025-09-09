export interface InputTag {
    tag_no: string;
    description: string | null;
    unit_name: string | null;
    jm_input: number;
}

/**
 * Describes a single, previously saved input value.
 * This represents an actual data point that has been stored.
 */
export interface ExistingInput {
    tag_no: string;
    value: number | null; // The saved value can be null
    date_rec: string;
}

/**
 * The main data structure that holds all information for a specific tab's inputs.
 */
export interface InputTagsData {
    /** An array defining all the input tags required for this tab. */
    input_tags: InputTag[];

    /**
     * An object (dictionary) of existing saved values.
     * The key is a composite string, typically like "TAG_NO_YYYY-MM-DD HH:MM:SS".
     */
    existing_inputs: Record<string, ExistingInput>;
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
