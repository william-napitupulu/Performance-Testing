import { Link } from '@inertiajs/react';
import axios from 'axios';
import { AlignLeft, ArrowLeft, BarChart2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { OutputDataTab } from './OutputDataTab';
import type { OutputData, ApiResponse, ReferencesApiResponse, ChartApiResponse, ChartDataPoint, Reference } from './types';
import { ParetoChartTab } from "./ParetoTab";
import { ParetoChartTab2 } from "./ParetoTab2";

type TabType = 'output' | string; // Allow dynamic tab IDs

interface TabConfig {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

// Base tabs that are always present
const BASE_TABS: TabConfig[] = [
    { id: 'output', label: 'Output', icon: AlignLeft, color: 'green' },
    { id: 'pareto', label: 'Pareto Chart', icon: BarChart2, color: 'indigo' },
    { id: 'pareto2', label: 'Pareto Chart 2', icon: BarChart2, color: 'indigo' },
];

interface SharedPerformanceData {
    description: string;
    dateTime: string;
    perfId?: number;
}

export function OutputContainer() {
    const [activeTab, setActiveTab] = useState<TabType>('output');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<OutputData[]>([]);
    const [sharedData, setSharedData] = useState<SharedPerformanceData>({
        description: '',
        dateTime: '',
    });
    // ✅ TYPED: useState now has a specific type
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [chartLoading, setChartLoading] = useState(true);
    // ✅ TYPED: useState now has a specific type
    const [references, setReferences] = useState<Reference[]>([]);
    const [selectedRefId, setSelectedRefId] = useState<number | null>(null);

    const [apiResponse, setApiResponse] = useState<ApiResponse>({
        success: true,
        data: [],
        pagination: {
            current_page: 1,
            total: 0,
            per_page: 999999,
            last_page: 1,
            from: 0,
            to: 0,
        },
        filters: {
            search: '',
        },
        sort: {
            field: 'output_id',
            direction: 'asc',
        },
        performance: undefined,
    });

    const [performanceId, setPerformanceId] = useState<number | undefined>();

    

    const fetchReferences = async () => {
        try {
            // ✅ TYPED: axios call now expects a specific response shape
            const response = await axios.get<ReferencesApiResponse>('/api/output/references');
            const refs = response.data.data || [];
            setReferences(refs);

            const defaultRef = refs.find(ref => ref.is_default === 1);
            if (defaultRef) {
                setSelectedRefId(defaultRef.reff_id);
            } else if (refs.length > 0) {
                setSelectedRefId(refs[0].reff_id);
            }
        // ✅ RESOLVED: Safe error handling
        } catch (error: unknown) {
            console.error("Failed to fetch references:", error);
        }
    };

    const fetchChartData = useCallback(async (perfId: number, refId: number) => {
        if (!perfId || !refId) return;
        setChartLoading(true);
        try {
            // ✅ TYPED: axios call now expects a specific response shape
            const response = await axios.get<ChartApiResponse>(`/api/output/pareto/${perfId}/${refId}`);
            setChartData(response.data.data || []);
        // ✅ RESOLVED: Safe error handling
        } catch (error: unknown) {
            console.error('Error fetching chart data:', error);
            setChartData([]);
        } finally {
            setChartLoading(false);
        }
    }, []);

    const fetchData = useCallback(async (params: {
        search?: string;
        sort_field?: string;
        sort_direction?: string;
        perf_id?: number;
    } = {}) => {
        const targetPerfId = params.perf_id || performanceId;
        if (!targetPerfId) {
            console.log('Skipping fetch: no performance ID is set.');
            return;
        }

        setLoading(true);

        const apiParams = {
            perf_id: targetPerfId,
            per_page: 999999,
            sort_field: params.sort_field || apiResponse.sort.field,
            sort_direction: params.sort_direction || apiResponse.sort.direction,
            search: params.search ?? apiResponse.filters.search,
        };

        try {
            const response = await axios.get<ApiResponse>('/api/output/details/data', { params: apiParams });
            const { data: responseData, performance } = response.data;

            setData(responseData || []);
            setApiResponse(response.data);

            // Set shared data only if it's the first time loading for this performance
            if (performance && performance.id === targetPerfId) {
                setPerformanceId(performance.id);
                setSharedData({
                    description: performance.description,
                    dateTime: performance.date_perfomance,
                    perfId: performance.id,
                });
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled');
            } else {
                console.error('Error fetching data:', error);
            }
        } finally {
            setLoading(false);
        }
    }, [performanceId, apiResponse.sort, apiResponse.filters]);

    useEffect(() => {
        const initializeData = async () => {
            const params = new URLSearchParams(window.location.search);
            const perfIdFromUrl = params.get('perf_id');
            let initialPerfId: number | undefined;

            if (perfIdFromUrl) {
                const perfIdNum = parseInt(perfIdFromUrl, 10);
                if (!isNaN(perfIdNum)) {
                    initialPerfId = perfIdNum;
                }
            }
            await Promise.all([
                fetchData({ perf_id: initialPerfId }),
                fetchReferences()
            ]);
        };

        initializeData();
    }, [fetchData]);

    useEffect(() => {
        if (performanceId && selectedRefId) {
            fetchChartData(performanceId, selectedRefId);
        }
    }, [performanceId, selectedRefId, fetchChartData]);

    const handleReferenceChange = (refId: string) => {
        setSelectedRefId(Number(refId));
    }

    const handleTableChange = useCallback(
        (params: { search?: string; sort_field?: string; sort_direction?: string }) => {
            fetchData(params);
        },
        [fetchData],
    );

    // Function to trigger refetch of main data table (only called explicitly)

    // Generate dynamic tabs based on active tab count (memoized to prevent recreation)
    const tabsConfig = useMemo((): TabConfig[] => {
        const tabs: TabConfig[] = [...BASE_TABS];

        return tabs;
    }, []);

    const handleTabChange = (tab: TabType) => {
        console.log('Switching to tab:', tab);
        setActiveTab(tab);
    };

    const canAccessTab = (tabId: string) => {
        // Base tabs and run tab are always accessible
        if (tabId === 'new-performance' || tabId === 'output' || tabId === 'run') {
            return true;
        }

        return true;
    };

    const getTabActiveClass = (color: string) => {
        switch (color) {
            case 'green':
                return 'bg-green-600 text-white shadow-md';
            case 'emerald':
                return 'bg-emerald-600 text-white shadow-md';
            case 'orange':
                return 'bg-orange-600 text-white shadow-md';
            case 'purple':
                return 'bg-purple-600 text-white shadow-md';
            case 'blue':
                return 'bg-blue-600 text-white shadow-md';
            case 'indigo':
                return 'bg-indigo-600 text-white shadow-md';
            case 'pink':
                return 'bg-pink-600 text-white shadow-md';
            case 'cyan':
                return 'bg-cyan-600 text-white shadow-md';
            case 'teal':
                return 'bg-teal-600 text-white shadow-md';
            case 'lime':
                return 'bg-lime-600 text-white shadow-md';
            case 'amber':
                return 'bg-amber-600 text-white shadow-md';
            case 'red':
                return 'bg-red-600 text-white shadow-md';
            default:
                return 'bg-gray-600 text-white shadow-md';
        }
    };

    // Render dynamic tab content - keep it simple to avoid re-renders
    const renderTabContent = (tabId: string) => {
        if (tabId === 'output') {
            return (
                <OutputDataTab
                    data={data}
                    pagination={apiResponse.pagination}
                    filters={apiResponse.filters}
                    sort={apiResponse.sort}
                    loading={loading}
                    onDataUpdate={handleTableChange}
                    sharedData={sharedData}
                    apiResponse={apiResponse}
                />
            );
        }

        if (tabId === 'pareto') {
            return (
                <ParetoChartTab 
                    data={chartData} 
                    loading={chartLoading}
                    references={references}
                    selectedReferenceId={selectedRefId}
                    onReferenceChange={handleReferenceChange}
                />
            );
        }

        

        if (tabId === 'pareto2') {
            return (
                <ParetoChartTab2 
                    data={chartData} 
                    loading={chartLoading}
                    references={references}
                    selectedReferenceId={selectedRefId}
                    onReferenceChange={handleReferenceChange}
                />
            );
        }

        return null;
    };

    // Use the memoized tabs configuration

    return (
        <div className="bg-background p-6">
            {/* Back to Performance List */}
            <div className="mb-4">
                <Link href={route('output.performance')} className="inline-flex items-center text-blue-600 hover:underline dark:text-blue-400">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to Performance Output
                </Link>
            </div>

            {/* Tab Navigation */}
            <div className="mb-0">
                <div className="flex flex-wrap gap-2 rounded-t-lg bg-gray-100 p-2 dark:bg-gray-800">
                    {tabsConfig.map((tab: TabConfig) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const isAccessible = canAccessTab(tab.id);

                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                disabled={!isAccessible}
                                className={`flex items-center rounded-md px-4 py-2 font-medium transition-all duration-200 ${
                                    !isAccessible
                                        ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                                        : isActive
                                          ? getTabActiveClass(tab.color)
                                          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                } `}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {tab.label}
                                {!isAccessible && <span className="ml-2 text-xs">🔒</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab && (
                    <React.Fragment key={`${activeTab}-${sharedData.perfId || 'no-perf'}`}>
                    {renderTabContent(activeTab)}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}
