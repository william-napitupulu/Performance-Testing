import { AlertTriangle, BarChart3, Download, Info, Save } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { OutputTable } from './OutputTable';
import type { OutputData, ApiResponse } from './types';
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    const [newBaselineDesc, setNewBaselineDesc] = useState('');
    const [newBaselineKeterangan, setNewBaselineKeterangan] = useState('');

    useEffect(() => {
        if (performance) {

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear().toString().slice(-2);
            setNewBaselineDesc(`Baseline (${performance.id}) (${day}-${month}-${year})`);
            setNewBaselineKeterangan(`Created from performance test on ${new Date(performance.date_perfomance).toLocaleDateString()}`);
        }
    }, [performance]);

    const handleCreateBaseline = async () => {
        if (!performance || !newBaselineDesc) {
            toast.error("Baseline descripiton cannot be empty.");
            return;
        }

        setIsCreating(true);
        try {
            const response = await axios.post(route('api.output.create-baseline'), {
                performance_id: performance.id,
                description: newBaselineDesc,
                keterangan: newBaselineKeterangan,
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
            <Toaster richColors />
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
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 dark:from-blue-700 dark:to-indigo-700">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-white/20 p-2">
                                <BarChart3 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Performance Analysis Results</h2>
                                <p className="text-sm text-blue-100">Detailed analysis data and performance metrics</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6 dark:border-gray-700">
                             <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <Info className="mr-2 h-5 w-5 text-gray-500" />
                                Performance Information
                            </h3>
                        </div>

                        {/* Main grid for details and actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Left Side: Information List */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center">
                                    <span className="w-28 text-sm font-semibold text-gray-500 dark:text-gray-400">ID</span>
                                    <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{performance?.id || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 text-sm font-semibold text-gray-500 dark:text-gray-400">Created</span>
                                    <span className="text-sm text-gray-800 dark:text-gray-200">
                                        {performance ? new Date(performance.date_perfomance).toLocaleString('en-GB') : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-28 flex-shrink-0 text-sm font-semibold text-gray-500 dark:text-gray-400">Description</span>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{performance?.description || 'No description provided.'}</p>
                                </div>
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div className="md:col-span-1 flex flex-col md:items-end justify-start gap-2">
                                {performance?.report_download_url && (
                                    <Button asChild className="group w-full md:w-auto transform bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl">
                                        <a href={performance.report_download_url} target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Report
                                        </a>
                                    </Button>
                                )}
                                <div className="space-y-3 rounded-lg border bg-slate-50 p-4 dark:bg-slate-800/50 dark:border-slate-700">
                                    <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">Create New Baseline</h4>
                                    <div className="space-y-1">
                                        <Label htmlFor="baseline-desc">Description</Label>
                                        <Input 
                                            id="baseline-desc"
                                            value={newBaselineDesc}
                                            onChange={(e) => setNewBaselineDesc(e.target.value)}
                                            placeholder="Enter baseline name..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="baseline-ket">Notes (Keterangan)</Label>
                                        <Input 
                                            id="baseline-ket"
                                            value={newBaselineKeterangan}
                                            onChange={(e) => setNewBaselineKeterangan(e.target.value)}
                                            placeholder="Optional notes..."
                                        />
                                    </div>
                                    <Button
                                        onClick={handleCreateBaseline}
                                        disabled={isCreating || !newBaselineDesc}
                                        className="w-full"
                                    >
                                        {isCreating ? 'Saving...' : (
                                            <>
                                                <Save className="mr-2 h-4 w-4"/>
                                                Save as Baseline
                                            </>
                                        )}
                                    </Button>
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
