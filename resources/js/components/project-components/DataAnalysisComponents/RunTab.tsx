import { Play, Download, FileText, Clock, CheckCircle, AlertCircle, Database, TrendingUp, BarChart3, Activity, XCircle } from 'lucide-react';
import axios from 'axios';
import { useState, useMemo } from 'react';

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
  tabCount?: number;
}

interface TabInputData {
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
}

interface RunTabProps {
  onRunAnalysis?: () => void;
  sharedData?: SharedPerformanceData;
  // Data from DATA DCS
  dcsData?: any[];
  // Input data for all tabs (to check if manual inputs are filled)
  tabInputData?: Record<string, TabInputData>;
  // Total records from save data tab
  totalRecords?: number;
}

export function RunTab({ onRunAnalysis, sharedData, dcsData, tabInputData, totalRecords }: RunTabProps) {
  const [exportLoading, setExportLoading] = useState(false);

  // Check the 3 conditions
  const statusChecks = useMemo(() => {
    // 1. Data Status: Check if there's data in DATA DCS
    const hasDataInDCS = (dcsData && dcsData.length > 0) || (totalRecords && totalRecords > 0);
    
    // 2. Configuration: Check if all tabs with manual input have all their fields filled
    let allTabsConfigured = true;
    let totalInputFields = 0;
    let filledInputFields = 0;
    
    if (tabInputData && sharedData?.tabCount) {
      for (let i = 1; i <= sharedData.tabCount; i++) {
        const tabKey = `tab${i}`;
        const tabData = tabInputData[tabKey];
        
        if (tabData && tabData.input_tags && tabData.input_tags.length > 0) {
          // Count expected input fields for this tab
          tabData.input_tags.forEach(tag => {
            if (tag.jm_input > 0) {
              totalInputFields += tag.jm_input;
            }
          });
          
          // Count filled input fields for this tab
          if (tabData.existing_inputs) {
            Object.values(tabData.existing_inputs).forEach(input => {
              if (input.value !== null && input.value !== undefined && input.value !== 0) {
                filledInputFields++;
              }
            });
          }
        }
      }
      
      // If we have input fields but not all are filled, configuration is incomplete
      if (totalInputFields > 0 && filledInputFields < totalInputFields) {
        allTabsConfigured = false;
      }
    }
    
    // 3. Analysis: Not implemented yet, so always true for now
    const analysisReady = true;
    
    return {
      dataStatus: hasDataInDCS,
      configurationStatus: allTabsConfigured,
      analysisStatus: analysisReady,
      totalInputFields,
      filledInputFields
    };
  }, [dcsData, tabInputData, sharedData?.tabCount, totalRecords]);

  // All conditions must be met to enable Run Analysis
  const canRunAnalysis = statusChecks.dataStatus && statusChecks.configurationStatus && statusChecks.analysisStatus;

  const handleRunAnalysis = () => {
    if (!canRunAnalysis) {
      alert('Cannot run analysis: Please ensure all conditions are met (Data Status, Configuration, and Analysis readiness).');
      return;
    }
    
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
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-b-lg border border-border dark:border-gray-700">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-lg">
          <Activity className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Performance Analysis</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Execute comprehensive analysis with all configured parameters and export detailed results for further evaluation.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Data Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Data Status</h3>
              </div>
            </div>
            {statusChecks.dataStatus ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {statusChecks.dataStatus 
              ? `Data loaded (${totalRecords || 0} records in DATA DCS)` 
              : 'No data found in DATA DCS - load performance data first'}
          </p>
        </div>

        {/* Configuration Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Configuration</h3>
              </div>
            </div>
            {statusChecks.configurationStatus ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {statusChecks.configurationStatus 
              ? `All manual inputs filled (${statusChecks.filledInputFields}/${statusChecks.totalInputFields} fields)` 
              : `Manual inputs incomplete (${statusChecks.filledInputFields}/${statusChecks.totalInputFields} fields filled)`}
          </p>
        </div>

        {/* Analysis Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Analysis</h3>
              </div>
            </div>
            {statusChecks.analysisStatus ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {statusChecks.analysisStatus 
              ? 'Analysis engine ready to execute' 
              : 'Analysis engine not ready'}
          </p>
        </div>
      </div>

      {/* Conditions Warning */}
      {!canRunAnalysis && (
        <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-4 border-orange-500 dark:border-orange-400 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                Analysis Requirements Not Met
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Please ensure all conditions are satisfied before running the analysis:
              </p>
              <ul className="text-sm text-orange-700 dark:text-orange-300 mt-2 space-y-1">
                {!statusChecks.dataStatus && <li>• Load performance data into DATA DCS</li>}
                {!statusChecks.configurationStatus && <li>• Complete all manual input fields in the tabs</li>}
                {!statusChecks.analysisStatus && <li>• Ensure analysis engine is ready</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      {sharedData?.perfId && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-700/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Current Performance Test</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Description:</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{sharedData.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Date/Time:</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(sharedData.dateTime).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Performance ID:</span>
                <span className="text-sm font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                  #{sharedData.perfId}
                </span>
              </div>
              {sharedData.tabCount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Tabs:</span>
                  <span className="text-sm bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                    {sharedData.tabCount} tabs
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {canRunAnalysis ? 'Ready to Execute' : 'Prerequisites Required'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {canRunAnalysis 
              ? 'All conditions have been met. You can now run the analysis or export the current data.'
              : 'Please satisfy all requirements above before running the analysis.'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={handleRunAnalysis}
            disabled={!canRunAnalysis}
            className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform min-w-[200px] ${
              canRunAnalysis
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:scale-105'
                : 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {canRunAnalysis && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            )}
            <Play className="h-5 w-5 relative z-10" />
            <span className="relative z-10">
              {canRunAnalysis ? 'Run Analysis' : 'Requirements Not Met'}
            </span>
          </button>
          
          <button
            onClick={handleExportExcel}
            disabled={exportLoading || !sharedData?.perfId}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg min-w-[200px]"
          >
            {!exportLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            )}
            {exportLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent relative z-10"></div>
                <span className="relative z-10">Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5 relative z-10" />
                <span className="relative z-10">Export to Excel</span>
              </>
            )}
          </button>
        </div>

        {/* Information Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-4 w-4" />
            <span>
              {canRunAnalysis 
                ? 'All prerequisites satisfied - analysis ready to execute'
                : 'Complete all requirements above to enable analysis execution'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 