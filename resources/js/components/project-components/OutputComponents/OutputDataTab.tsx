import { AlertTriangle, BarChart3, Calendar, Database, Hash } from 'lucide-react';
import React, { useCallback } from 'react';
import { OutputTable } from './OutputTable';
import type { OutputData, ApiResponse } from './types';

interface SharedPerformanceData {
    description: string;
    dateTime: string;
    perfId?: number;
}

interface OutputDataTabProps {
    data: OutputData[];
    pagination: ApiResponse['pagination'];
    filters: ApiResponse['filters'];
    sort: ApiResponse['sort'];
    loading: boolean;
    onDataUpdate: (params: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
    }) => void;
    sharedData: SharedPerformanceData;
    apiResponse: ApiResponse;
}

export const OutputDataTab = React.memo(function OutputDataTab({
    data, 
    pagination, 
    filters, 
    sort, 
    loading, 
    onDataUpdate, 
    sharedData,
    apiResponse,
}: OutputDataTabProps) {
    const performance = apiResponse.performance;

    const handleSort = useCallback(
        async (field: string) => {
            const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
            onDataUpdate({
                search: filters.search || '',
                sort_field: field,
                sort_direction: newDirection,
            });
        },
        [sort, filters, onDataUpdate],
    );

    const handleFilterChange = useCallback(
        (params: { search: string }) => {
            onDataUpdate({
                ...params,
                sort_field: sort.field,
                sort_direction: sort.direction,
            });
        },
        [sort, onDataUpdate],
    );

    return (
        <div className="space-y-6">
            {/* Warning when no performance selected */}
            {!sharedData.perfId ? (
                <div className="border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:border-orange-400 dark:from-orange-900/20 dark:to-red-900/20">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                        <div>
                            <h3 className="font-semibold text-orange-800 dark:text-orange-200">No Performance Test Output Selected</h3>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                                Please select a performance from the test output page or run an analysis to get an output of performance test.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden rounded-b-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 dark:from-blue-700 dark:to-indigo-700">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-b-lg bg-white/20 p-2">
                                    <BarChart3 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Performance Analysis Results</h2>
                                    <p className="text-sm text-blue-100">Detailed analysis data and performance metrics</p>
                                </div>
                            </div>
                            
                            {performance?.report_download_url && (
                                <a
                                    href={performance.report_download_url}
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-50"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download Report
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Description */}
                            <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-gray-800">
                                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    Test Description
                                </h3>
                                <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">{sharedData.description}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Date/Time */}
                                <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/50">
                                                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-purple-700 dark:text-purple-300">Date & Time</h4>
                                            <p className="font-medium text-purple-900 dark:text-purple-100">
                                                {new Date(sharedData.dateTime).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-sm text-purple-600 dark:text-purple-400">
                                                {new Date(sharedData.dateTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance ID */}
                                {sharedData.perfId && (
                                    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:border-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                                                    <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="mb-1 text-sm font-medium text-blue-700 dark:text-blue-300">Performance ID</h4>
                                                <p className="font-mono text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                    {sharedData.perfId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Total Records */}
                                <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-amber-700 dark:from-amber-900/20 dark:to-orange-900/20">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/50">
                                                <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-amber-700 dark:text-amber-300">Total Records</h4>
                                            <p className="text-lg font-bold text-amber-900 dark:text-amber-100">{pagination?.total || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results - Only show when performance test is selected */}
            {sharedData.perfId && (
                <OutputTable
                    data={data}
                    loading={loading}
                    sort={sort}
                    pagination={pagination}
                    onSort={handleSort}
                    onFilterChange={handleFilterChange}
                    searchValue={filters.search || ''}
                />
            )}
        </div>
    );
});
