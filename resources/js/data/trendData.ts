export interface Trend {
    reff_id: number; // reff_id from database
    description: string;
    keterangan: string;
    unit_id: number;
    date_created: string;
    is_default: number; // 0 or 1
    perf_id: number | null; // The performance it was created from
    details?: TrendDetail[]; // Array of baseline details
}

export interface TrendDetail {
    id: number;
    output_id: string;
    value: number;
    output_tag: {
        description: string;
        satuan: string;
    }
}