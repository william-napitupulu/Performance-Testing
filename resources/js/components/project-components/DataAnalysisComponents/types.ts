export interface AnalysisData {
  id: number | string;
  no: number;
  tag_no: string;
  description?: string;
  value?: number | string; // Keep for backward compatibility
  min?: number | string;
  max?: number | string;
  average?: number | string;
  unit_name?: string;
  group_id?: number;
  urutan?: number;
  date_rec?: string | null;
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
  value_max: string;
  date: string;
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
    value_min: string | null;
    value_max: string | null;
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
  input_tags?: {
    tab1: {
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
    tab2: {
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
    tab3: {
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
  };
}

export interface ApiFilters {
  tag_no?: string;
  value_min?: string;
  value_max?: string;
  date?: string;
} 