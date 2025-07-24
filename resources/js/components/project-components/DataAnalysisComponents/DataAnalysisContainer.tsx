import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Database, Settings, BarChart3, Cog, Plus, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { NewPerformanceTestTab } from './NewPerformanceTestTab';
import { RunTab } from './RunTab';
import { SaveDataTab } from './SaveDataTab';
import { UniversalTabProvider } from './shared/UniversalTabContext';
import { UnifiedTabTemplate } from './UnifiedTabTemplate';
import type { AnalysisData, ApiResponse } from './types';
import axios from 'axios';

type TabType = 'new-performance' | 'save-data' | 'run' | string; // Allow dynamic tab IDs

interface TabConfig {
  id: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<import('lucide-react').LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  color: string;
}

// Base tabs that are always present
const BASE_TABS: TabConfig[] = [
  { id: 'new-performance', label: 'New Performance Test', icon: Plus, color: 'green' },
  { id: 'save-data', label: 'DATA DCS', icon: Database, color: 'green' },
];

// Dynamic tab colors cycle
const TAB_COLORS = ['emerald', 'orange', 'purple', 'blue', 'indigo', 'pink', 'cyan', 'teal', 'lime', 'amber'];

// Tab icons cycle
const TAB_ICONS = [Settings, BarChart3, Cog, Settings, BarChart3, Cog, Settings, BarChart3, Cog, Settings];

const RUN_TAB: TabConfig = { id: 'run', label: 'Run', icon: Play, color: 'red' };

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
  tabCount?: number;
}

export function DataAnalysisContainer() {
  const [activeTab, setActiveTab] = useState<TabType>('new-performance');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisData[]>([]);
  const [activeTabCount, setActiveTabCount] = useState<number>(3); // Default to 3 tabs
  const [sharedData, setSharedData] = useState<SharedPerformanceData>({
    description: '',
    dateTime: '',
    tabCount: 3
  });
  const [apiResponse, setApiResponse] = useState<ApiResponse>({
    success: true,
    data: [],
    pagination: {
      current_page: 1,
      total: 0,
      // MODIFIED: Set high per_page to show all data at once
      per_page: 1000, // Was: 10
      last_page: 1,
      from: 0,
      to: 0
    },
    filters: {
      tag_no: null,
      value_min: null,
      value_max: null,
      date: null
    },
    sort: {
      field: 'tag_no',
      direction: 'asc'
    },
    performance: undefined,
    input_tags: {},
    tab_names: {}
  });
  const [initializedFromPerfId, setInitializedFromPerfId] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [lastPerfId, setLastPerfId] = useState<number | undefined>();
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [stablePerfId, setStablePerfId] = useState<number | undefined>();

  // Update stable performance ID when shared data changes
  useEffect(() => {
    if (sharedData.perfId !== stablePerfId) {
      setStablePerfId(sharedData.perfId);
    }
  }, [sharedData.perfId, stablePerfId]);

  // Function to trigger refetch of main data table (only called explicitly)
  const refetchDataTable = useCallback(async () => {
    if (!stablePerfId) return;
    
    console.log('Refetching data table for performance:', stablePerfId);
    try {
      // MODIFIED: Add per_page parameter to fetch all data
      const response = await axios.get('/api/data-analysis/data', {
        params: { 
          perf_id: stablePerfId,
          per_page: 999999 // Fetch all records
        }
      });
      setData(response.data.data || []);
      setApiResponse(response.data);
      console.log('Data table refetched successfully after manual save');
    } catch (error: any) {
      if (axios.isCancel && !axios.isCancel(error)) {
        console.error('Error refetching data table:', error.message || error);
      }
    }
  }, [stablePerfId]);

  // Generate dynamic tabs based on active tab count (memoized to prevent recreation)
  const tabsConfig = useMemo((): TabConfig[] => {
    const tabs: TabConfig[] = [...BASE_TABS];
    
    // Add dynamic tabs with names from API response
    for (let i = 1; i <= activeTabCount; i++) {
      const tabName = apiResponse.tab_names?.[i] || `Tab ${i}`;
      tabs.push({
        id: `tab${i}`,
        label: tabName,
        icon: TAB_ICONS[i - 1],
        color: TAB_COLORS[i - 1]
      });
    }
    
    // Add run tab at the end
    tabs.push(RUN_TAB);
    
    return tabs;
  }, [activeTabCount, apiResponse.tab_names]);

  // Update tab count when shared data changes
  useEffect(() => {
    if (sharedData.tabCount && sharedData.tabCount !== activeTabCount) {
      setActiveTabCount(sharedData.tabCount);
    }
  }, [sharedData.tabCount, activeTabCount]);

  useEffect(() => {
    if (initializedFromPerfId) return;
    const params = new URLSearchParams(window.location.search);
    const perfIdParam = params.get('perf_id');
    if (perfIdParam) {
      const perfIdNum = parseInt(perfIdParam, 10);
      if (!isNaN(perfIdNum)) {
        (async () => {
          setLoading(true);
          try {
            // MODIFIED: Add per_page parameter to fetch all data
            const resp = await axios.get('/api/data-analysis/data', { 
              params: { 
                perf_id: perfIdNum,
                per_page: 999999 // Fetch all records
              } 
            });
            const perf = resp.data.performance;
            const tabCount = perf.jumlah_tab_aktif || 3; // Get tab count from performance record
            setSharedData({
              description: perf.description,
              dateTime: perf.date_perfomance,
              perfId: perf.id,
              tabCount: tabCount
            });
            setActiveTabCount(tabCount);
            setData(resp.data.data || []);
            setApiResponse(resp.data);
            setDataFetched(true);
            setInitialDataLoaded(true);
            setLastPerfId(perf.id);
            setActiveTab('save-data');
            console.log('Initial data loaded for performance:', perf.id);
          } catch (err: any) {
            if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
              console.error('Error loading performance:', err.message || err);
            }
          } finally {
            setLoading(false);
            setInitializedFromPerfId(true);
          }
        })();
      }
    }
  }, [initializedFromPerfId]);

  // Only reset dataFetched when performance ID actually changes to a different ID
  useEffect(() => {
    if (sharedData.perfId && sharedData.perfId !== lastPerfId && initialDataLoaded) {
      // Only reset if we're switching to a completely different performance AND we've already loaded initial data
      console.log('Performance ID changed from', lastPerfId, 'to', sharedData.perfId, '- resetting data');
      setDataFetched(false);
      setInitialDataLoaded(false);
      setLastPerfId(sharedData.perfId);
    }
  }, [sharedData.perfId, lastPerfId, initialDataLoaded]);

  const handleNewPerformanceSubmit = async (formData: { description: string; dateTime: string; type: string; weight: string }) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/data-analysis/get-data', {
        ...formData
      });
      
      // Store the shared data - tab count will come from the response
      setSharedData({
        description: formData.description,
        dateTime: formData.dateTime,
        perfId: response.data.perf_id,
        tabCount: response.data.performance?.jumlah_tab_aktif || 3
      });
      
      setActiveTabCount(response.data.performance?.jumlah_tab_aktif || 3);
      
      // Store the response data
      setData(response.data.data || []);
      setApiResponse(response.data);
      setDataFetched(true);
      setInitialDataLoaded(true);
      setLastPerfId(response.data.perf_id);
      
      // Automatically switch to Save Data tab to show results
      setActiveTab('save-data');
      console.log('New performance data loaded:', response.data.perf_id);
    } catch (error: any) {
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error('Error creating performance test:', error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove unused fetchDataForCurrentPerformance function

  const handleDataUpdate = useCallback(async (params: {
    // COMMENTED OUT: No longer using page parameter
    // page?: number;
    sort_field?: string;
    sort_direction?: string;
    filter_tag_no?: string;
    filter_value_min?: string;
    filter_value_max?: string;
    filter_date?: string;
    perf_id?: number;
  }) => {
    // Only allow data updates if we have initial data loaded and a performance ID
    if (!initialDataLoaded || !stablePerfId) {
      console.log('Skipping data update - no initial data loaded or no performance ID');
      return;
    }
    
    // MODIFIED: Add per_page parameter to fetch all data
    const apiParams = {
      ...params,
      per_page: 999999 // Fetch all records
    };
    
    console.log('Updating data with params:', apiParams);
    try {
      const response = await axios.get('/api/data-analysis/data', { 
        params: apiParams,
        timeout: 60000 // 60 second timeout
      });
      
      setData(response.data.data || []);
      setApiResponse(response.data);
    } catch (error: any) {
      if (error.name !== 'AbortError' && 
          error.code !== 'ERR_CANCELED' && 
          error.code !== 'ECONNABORTED' &&
          !(axios.isCancel && axios.isCancel(error))) {
        console.error('Error updating data:', error.message || error);
      }
    }
  }, [initialDataLoaded, stablePerfId]); // Use stable performance ID

  const handleTabChange = (tab: TabType) => {
    console.log('Switching to tab:', tab);
    setActiveTab(tab);
  };

  const canAccessTab = (tabId: string) => {
    // Base tabs and run tab are always accessible
    if (tabId === 'new-performance' || tabId === 'save-data' || tabId === 'run') {
      return true;
    }
    
    // Dynamic tabs are accessible only if they're within the active tab count
    if (tabId.startsWith('tab')) {
      const tabNumber = parseInt(tabId.replace('tab', ''));
      return tabNumber <= activeTabCount;
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
    if (tabId === 'new-performance') {
      return (
        <NewPerformanceTestTab
          onSubmit={handleNewPerformanceSubmit}
          loading={loading}
          sharedData={sharedData}
        />
      );
    }
    
    if (tabId === 'save-data') {
      return (
        <SaveDataTab
          data={data}
          pagination={apiResponse.pagination}
          filters={apiResponse.filters}
          sort={apiResponse.sort}
          loading={loading}
          onDataUpdate={handleDataUpdate}
          sharedData={sharedData}
        />
      );
    }
    
    if (tabId === 'run') {
      return (
        <RunTab 
          sharedData={sharedData} 
          dcsData={data}
          tabInputData={apiResponse.input_tags}
          totalRecords={data.length}
        />
      );
    }
    
    // Handle dynamic tabs with unified template
    if (tabId.startsWith('tab')) {
      const tabNumber = parseInt(tabId.replace('tab', ''));
      const tabKey = `tab${tabNumber}`;
      
      // Use unified tab system for all tabs 1-10
      if (tabNumber >= 1 && tabNumber <= 10) {
        return (
          <UniversalTabProvider
            sharedData={sharedData}
            inputTagsData={apiResponse.input_tags?.[tabKey]}
            onDataSaved={refetchDataTable}
            mInput={tabNumber}
          >
            <UnifiedTabTemplate
              tabNumber={tabNumber}
              sharedData={sharedData}
              inputTagsData={apiResponse.input_tags?.[tabKey]}
              onDataSaved={refetchDataTable}
            />
          </UniversalTabProvider>
        );
      }
    }
    
    return null;
  };

  // Use the memoized tabs configuration

  return (
    <div className="p-6 bg-background">
      {/* Back to Performance List */}
      <div className="mb-4">
        <Link href={route('performance.index')} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Performance List
        </Link>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-0">
        <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-t-lg">
          {tabsConfig.map((tab: TabConfig) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isAccessible = canAccessTab(tab.id);
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={!isAccessible}
                className={`
                  flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200
                  ${!isAccessible 
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                    : isActive 
                      ? getTabActiveClass(tab.color)
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                {!isAccessible && (
                  <span className="ml-2 text-xs">🔒</span>
                )}
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