export interface AnalysisData {
  id: number;
  no: number;
  parameter: string;
  uom: string;
  referenceData: number;
  existingData: number;
  gap: number;
}

export interface AnalysisFormData {
  id: string;
  description: string;
  dateTime: string;
}

export interface ApiResponse {
  success: boolean;
  status: number;
  data: string;
  headers: Record<string, string>;
  url: string;
  note?: string;
  error?: string;
  message?: string;
  details?: string;
} 