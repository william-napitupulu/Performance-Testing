import { AlertTriangle, BarChart3, Calendar, Database, Download, Hash, PlusCircle } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { OutputTable } from './OutputTable';
import type { OutputData, ApiResponse } from './types';
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import axios from "axios";

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

    const [isCreating, setIsCreating] = useState(false);

    const handleCreateBaseline = async () => {
        if (!performance) return;

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear().toString().slice(-2);

        const newBaselineName = `Baseline ${performance.id} ${day}-${month}-${year}`;

        const isConfirmed = window.confirm(
            `Are you sure you want to create a new baseline named "${newBaselineName}"?`
        );

        if (!isConfirmed) {
            toast.info("Baseline creation cancelled.");
            return;
        }

        setIsCreating(true);
        try {
            const response = await axios.post(route('api.output.create-baseline'), {
                performance_id: performance.id,
                description: newBaselineName,
            });

            toast.success(response.data.message || "Baseline created successfully!");
        } catch (error) {
            console.error("Failed to create baseline:", error);
            toast.error("Failed to create baseline. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

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
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-6">
                            <Toaster richColors/>
                            {/* Description */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex-grow rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-gray-800">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        Test Description
                                    </h3>
                                    <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">{sharedData.description}</p>
                                </div>
                                <div className="flex w-full flex-shrink-0 gap-2 sm:w-auto">
                                    {performance?.report_download_url && (
                                        <Button asChild className="group w-full flex-shrink-0 transform bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-base text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl sm:w-auto">
                                            <a href={performance.report_download_url} target="_blank" rel="noopener noreferrer">
                                                <Download className="mr-2 h-5 w-5" />
                                                Download Report
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleCreateBaseline}
                                        disabled={isCreating}
                                        variant="outline"
                                        className="group w-full bg-white/10 flex-shrink-0 text-white transition-all hover:bg-white/20 sm:w-auto px-6 py-6 text-base sm:w-auto"
                                    >
                                        {isCreating ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <PlusCircle className="mr-2 h-4 w-4"/>
                                                Create Baseline
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Button */}
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
