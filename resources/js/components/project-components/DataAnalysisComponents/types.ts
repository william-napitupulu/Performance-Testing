export interface AnalysisData {
  id: number;
  no: number;
  tag_no: string;
  value: number | string;
  date_rec: string | null;
}

export interface AnalysisFormData {
  description: string;
  dateTime: string;
}

export interface PerformanceRecord {
  id: number;
  description: string;
  date_perfomance: string;
  date_created: string;
  status: string;
  unit_id: number;
  unit_name: string;
}

export interface SearchFilters {
  tag_no: string;
  value_min: string;
  date_from: string;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data: AnalysisData[];
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
    tag_no: string | null;
    value: string | null;
    date: string | null;
  };
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  perf_id?: string;
  datetime?: string;
  performance?: {
    id: string;
    description: string;
    unit_name: string;
    status: string;
    date_perfomance: string;
  };
}

export interface ApiFilters {
  tag_no?: string;
  value?: string;
  date?: string;
} 