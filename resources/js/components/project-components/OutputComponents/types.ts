export interface OutputData {
    id: number | string;
    no: number;
    output_id: string;
    description?: string;
    value?: number | string;
    satuan?: string;
}

export interface ApiResponse {
    success?: boolean;
    message?: string;
    data: OutputData[];
    pagination: {
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
        from: number;
        to: number;
        performanceId?: string;
    };
    filters: {
        search: string | null;
    };
    sort: {
        field: string;
        direction: 'asc' | 'desc';
    };
    perf_id?: number;
    datetime?: string;
    performance?: {
        id: number;
        description: string;
        unit_name: string;
        status: string;
        date_perfomance: string;
        jumlah_tab_aktif?: number;
        report_filename?: string | null;
        report_download_url?: string | null;
    };
}