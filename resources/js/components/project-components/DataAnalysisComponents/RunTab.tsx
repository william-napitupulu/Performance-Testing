import axios from 'axios';
import { Activity, AlertCircle, BarChart3, CheckCircle, Clock, Database, Download, FileText, Play, TrendingUp, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

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
    existing_inputs: Record<
        string,
        {
            tag_no: string;
            value: number;
            date_rec: string;
        }
    >;
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
    const [showMissingDetails, setShowMissingDetails] = useState(false);

    // Check the 3 conditions
    const statusChecks = useMemo(() => {
        // 1. Data Status: Check if there's data in DATA DCS
        const hasDataInDCS = (dcsData && dcsData.length > 0) || (totalRecords && totalRecords > 0);

        // 2. Configuration: Check if all tabs with manual input have all their fields filled
        let allTabsConfigured = true;
        let totalInputFields = 0;
        let filledInputFields = 0;
        const missingFields: { tab: string; description: string }[] = [];
        
        if (tabInputData && sharedData?.tabCount) {
            for (let i = 1; i <= sharedData.tabCount; i++) {
                const tabKey = `tab${i}`;
                const tabData = tabInputData[tabKey];

                if (tabData && tabData.input_tags && tabData.input_tags.length > 0) {
                    // Count expected input fields for this tab
                    tabData.input_tags.forEach((tag) => {
                        if (tag.jm_input > 0) {
                            totalInputFields += tag.jm_input;
                            const allInputKeys = tabData.existing_inputs ? Object.keys(tabData.existing_inputs) : [];
                            const matchingKeys = allInputKeys.filter(key => key.startsWith(tag.tag_no + '_'));
                            const validFilledCount = matchingKeys.filter(key => {
                                const input = tabData.existing_inputs[key];
                                return input && input.value !== null && input.value !== undefined && input.value !== 0;
                            }).length;

                            filledInputFields += validFilledCount;

                            if (validFilledCount < tag.jm_input) {
                                missingFields.push({
                                    tab: `Tab ${i}`,
                                    description: `${tag.description} (${tag.unit_name}) - Missing ${tag.jm_input - validFilledCount} input`,
                                });
                            }
                            // const existingInput = matchingKey ? tabData.existing_inputs[matchingKey] : undefined;
                            // if (!existingInput || existingInput.value === null || existingInput.value === undefined || existingInput.value === 0) {
                            //     missingFields.push({
                            //         tab: `Tab ${i}`,
                            //         description: `${tag.description} (${tag.unit_name})`,
                            //     });
                            // } else {
                            //     filledInputFields += tag.jm_input;
                            // }
                        }
                    });

                    // Count filled input fields for this tab
                    // if (tabData.existing_inputs) {
                    //     Object.values(tabData.existing_inputs).forEach((input) => {
                    //         if (input.value !== null && input.value !== undefined && input.value !== 0) {
                    //             filledInputFields++;
                    //         }
                    //     });
                    // }
                }
            }

            
        }

        // If we have input fields but not all are filled, configuration is incomplete
        if (totalInputFields > 0 && filledInputFields < totalInputFields) {
            allTabsConfigured = false;
        }
        
        // 3. Analysis: Not implemented yet, so always true for now
        const analysisReady = true;
        return {
            dataStatus: hasDataInDCS,
            configurationStatus: allTabsConfigured,
            analysisStatus: analysisReady,
            totalInputFields,
            filledInputFields,
            missingFields,
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
        <div className="rounded-b-lg border border-border bg-gradient-to-br from-slate-50 to-blue-50 p-6 dark:border-gray-700 dark:from-gray-900 dark:to-blue-900/20">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                    <Activity className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">Performance Analysis</h2>
                <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
                    Execute comprehensive analysis with all configured parameters and export detailed results for further evaluation.
                </p>
            </div>

            {/* Status Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Data Status Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-white">Data Status</h3>
                            </div>
                        </div>
                        {statusChecks.dataStatus ? <CheckCircle className="h-6 w-6 text-green-500" /> : <XCircle className="h-6 w-6 text-red-500" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {statusChecks.dataStatus
                            ? `Data loaded (${totalRecords || 0} records in DATA DCS)`
                            : 'No data found in DATA DCS - load performance data first'}
                    </p>
                </div>

                {/* Configuration Status Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
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
                    {!statusChecks.configurationStatus && (
                        <button
                            onClick={() => setShowMissingDetails(!showMissingDetails)}
                            className="mt-2 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {showMissingDetails ? 'Hide Missing Details' : 'Show Missing Details'}
                        </button>
                    )}
                </div>

                {/* Analysis Status Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
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
                        {statusChecks.analysisStatus ? 'Analysis engine ready to execute' : 'Analysis engine not ready'}
                    </p>
                </div>
            </div>

            {/* Conditions Warning */}
            {showMissingDetails && (
                <div className="mb-8 rounded-lg border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:border-orange-400 dark:from-orange-900/20 dark:to-red-900/20">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                        <div>
                            <h3 className="font-semibold text-orange-800 dark:text-orange-200">Analysis Requirements Not Met</h3>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                                Please ensure all conditions are satisfied before running the analysis:
                            </p>
                            <ul className="mt-2 space-y-1 text-sm text-orange-700 dark:text-orange-300">
                                {!statusChecks.dataStatus && <li>• Load performance data into DATA DCS</li>}
                                {!statusChecks.analysisStatus && <li>• Ensure analysis engine is ready</li>}
                                {!statusChecks.configurationStatus && (
                                    <li>
                                        Complete all manual input fields. Missing:
                                        <ul className="mt-1 list-['-_'] space-y-1 pl-5">
                                            {statusChecks.missingFields.slice(0, 5).map((field, index) => (
                                                <li key={index}>
                                                    <span className="font-semibold">{field.tab}:</span> {field.description}
                                                </li>
                                            ))}
                                            {statusChecks.missingFields.length > 5 && (
                                                <li>...and {statusChecks.missingFields.length - 5} more</li>
                                            )}
                                        </ul>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Summary */}
            {sharedData?.perfId && (
                <div className="mb-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg dark:border-blue-700/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Current Performance Test</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                        hour12: false,
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Performance ID:</span>
                                <span className="rounded bg-blue-100 px-2 py-1 font-mono text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    #{sharedData.perfId}
                                </span>
                            </div>
                            {sharedData.tabCount && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Tabs:</span>
                                    <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        {sharedData.tabCount} tabs
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 text-center">
                    <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                        {canRunAnalysis ? 'Ready to Execute' : 'Prerequisites Required'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {canRunAnalysis
                            ? 'All conditions have been met. You can now run the analysis or export the current data.'
                            : 'Please satisfy all requirements above before running the analysis.'}
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                    <button
                        onClick={handleRunAnalysis}
                        disabled={!canRunAnalysis}
                        className={`group relative flex min-w-[200px] transform items-center justify-center gap-3 rounded-xl px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl ${
                            canRunAnalysis
                                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:scale-105 hover:from-red-700 hover:to-red-800'
                                : 'cursor-not-allowed bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                        }`}
                    >
                        {canRunAnalysis && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-red-600 opacity-25 blur transition-opacity duration-300 group-hover:opacity-40"></div>
                        )}
                        <Play className="relative z-10 h-5 w-5" />
                        <span className="relative z-10">{canRunAnalysis ? 'Run Analysis' : 'Requirements Not Met'}</span>
                    </button>

                    <button
                        onClick={handleExportExcel}
                        disabled={exportLoading || !sharedData?.perfId}
                        className="group relative flex min-w-[200px] transform items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-lg"
                    >
                        {!exportLoading && (
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-green-600 opacity-25 blur transition-opacity duration-300 group-hover:opacity-40"></div>
                        )}
                        {exportLoading ? (
                            <>
                                <div className="relative z-10 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span className="relative z-10">Exporting...</span>
                            </>
                        ) : (
                            <>
                                <Download className="relative z-10 h-5 w-5" />
                                <span className="relative z-10">Export to Excel</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Information Footer */}
                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
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
