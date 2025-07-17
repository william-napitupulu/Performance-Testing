import { Play, Download } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
  tabCount?: number;
}

interface RunTabProps {
  onRunAnalysis?: () => void;
  sharedData?: SharedPerformanceData;
}

export function RunTab({ onRunAnalysis, sharedData }: RunTabProps) {
  const [exportLoading, setExportLoading] = useState(false);

  const handleRunAnalysis = () => {
    if (onRunAnalysis) {
      onRunAnalysis();
    } else {
      alert('Run Analysis functionality will be implemented here!');
    }
  };

  const handleExportExcel = async () => {
    if (!sharedData?.perfId) {
      alert('No performance data to export. Please create or select a performance test first.');
      return;
    }

    setExportLoading(true);
    try {
      const response = await axios.get('/api/data-analysis/export-excel', {
        params: { perf_id: sharedData.perfId },
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from response headers if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'Performance_Analysis_Export.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      console.error('Export error:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="rounded-b-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Run Analysis</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Execute the complete analysis process with all configured parameters and export results.
      </p>
      
      <div className="space-y-4">
        {/* Performance Summary */}
        {sharedData?.perfId && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/50">
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Current Performance Test</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">Description:</span> {sharedData.description}</p>
              <p><span className="font-medium">Date/Time:</span> {new Date(sharedData.dateTime).toLocaleString()}</p>
              <p><span className="font-medium">Performance ID:</span> {sharedData.perfId}</p>
              {sharedData.tabCount && (
                <p><span className="font-medium">Active Tabs:</span> {sharedData.tabCount}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-foreground dark:text-white mb-2">Available Actions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Review your configuration from all tabs before running the analysis or export the current data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRunAnalysis}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              <Play className="h-5 w-5" />
              Run Analysis
            </button>
            
            <button
              onClick={handleExportExcel}
              disabled={exportLoading || !sharedData?.perfId}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {exportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Export to Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 