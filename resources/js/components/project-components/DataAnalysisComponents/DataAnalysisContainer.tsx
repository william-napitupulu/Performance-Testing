import React, { useState, useEffect } from 'react';
import { Play, Database, Settings, BarChart3, Cog, Plus, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { NewPerformanceTestTab } from './NewPerformanceTestTab';
import { RunTab } from './RunTab';
import { Tab1 } from './Tab1';
import { Tab2 } from './Tab2';
import { Tab3 } from './Tab3';
import { SaveDataTab } from './SaveDataTab';
import type { AnalysisData, ApiResponse } from './types';
import axios from 'axios';
import { Tab1Provider } from './Tab1Context';
import { Tab2Provider } from './Tab2Context';
import { Tab3Provider } from './Tab3Context';

type TabType = 'new-performance' | 'save-data' | 'tab1' | 'tab2' | 'tab3' | 'run';

const TABS = [
  { id: 'new-performance', label: 'New Performance Test', icon: Plus, color: 'green' },
  { id: 'save-data', label: 'DATA DCS', icon: Database, color: 'green' },
  { id: 'tab1', label: 'Tab 1', icon: Settings, color: 'emerald' },
  { id: 'tab2', label: 'Tab 2', icon: BarChart3, color: 'orange' },
  { id: 'tab3', label: 'Tab 3', icon: Cog, color: 'purple' },
  { id: 'run', label: 'Run', icon: Play, color: 'red' }
] as const;

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
}

export function DataAnalysisContainer() {
  const [activeTab, setActiveTab] = useState<TabType>('new-performance');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisData[]>([]);
  const [sharedData, setSharedData] = useState<SharedPerformanceData>({
    description: '',
    dateTime: ''
  });
  const [apiResponse, setApiResponse] = useState<ApiResponse>({
    success: true,
    data: [],
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 10,
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
      field: 'group_id',
      direction: 'asc'
    },
    input_tags: {
      tab1: { input_tags: [], existing_inputs: {} },
      tab2: { input_tags: [], existing_inputs: {} },
      tab3: { input_tags: [], existing_inputs: {} }
    }
  });
  const [initializedFromPerfId, setInitializedFromPerfId] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // Track if data has been fetched
  const [lastPerfId, setLastPerfId] = useState<number | undefined>(); // Track last performance ID

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
            const resp = await axios.get('/api/data-analysis/data', { params: { perf_id: perfIdNum } });
            const perf = resp.data.performance;
            setSharedData({
              description: perf.description,
              dateTime: perf.date_perfomance,
              perfId: perf.id,
            });
            setData(resp.data.data || []);
            setApiResponse(resp.data);
            setDataFetched(true); // Mark data as fetched
            setLastPerfId(perf.id); // Track this performance ID
            setActiveTab('save-data');
          } catch (err: any) {
            // Only log actual errors (not aborts/cancellations) to console
            if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
              console.error('Error loading performance', err);
            }
          } finally {
            setLoading(false);
            setInitializedFromPerfId(true);
          }
        })();
      }
    }
  }, [initializedFromPerfId]);

  // Reset dataFetched when performance ID changes
  useEffect(() => {
    if (sharedData.perfId && sharedData.perfId !== lastPerfId) {
      // Performance ID has changed to a different value
      setDataFetched(false);
      setLastPerfId(sharedData.perfId);
      // Performance ID changed, will refetch data
    }
  }, [sharedData.perfId, lastPerfId]);

  const handleNewPerformanceSubmit = async (formData: { description: string; dateTime: string }) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/data-analysis/get-data', formData);
      
      // Store the shared data
      setSharedData({
        description: formData.description,
        dateTime: formData.dateTime,
        perfId: response.data.perf_id
      });
      
      // Store the response data
      setData(response.data.data || []);
      setApiResponse(response.data);
      setDataFetched(true); // Mark data as fetched
      setLastPerfId(response.data.perf_id); // Track this performance ID
      
      // Automatically switch to Save Data tab to show results
      setActiveTab('save-data');
    } catch (error: any) {
      // Only log actual errors (not aborts/cancellations) to console
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error('Error creating performance test:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDataForCurrentPerformance = async () => {
    if (!sharedData.perfId || dataFetched) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/data-analysis/data', { 
        params: { perf_id: sharedData.perfId } 
      });
      setData(response.data.data || []);
      setApiResponse(response.data);
      setDataFetched(true);
    } catch (error: any) {
      // Only log actual errors (not aborts/cancellations) to console
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error('Error fetching data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = async (params: {
    page?: number;
    sort_field?: string;
    sort_direction?: string;
    filter_tag_no?: string;
    filter_value_min?: string;
    filter_value_max?: string;
    filter_date?: string;
    perf_id?: number;
  }) => {
    try {
      const response = await axios.get('/api/data-analysis/data', { params });
      setData(response.data.data || []);
      setApiResponse(response.data);
    } catch (error: any) {
      // Only log actual errors (not aborts/cancellations) to console
      if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
        console.error('Error updating data:', error);
      }
    }
  };

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    
    // Auto-fetch data when switching to DATA DCS tab if we have a performance selected
    // but haven't fetched data yet
    if (tab === 'save-data' && sharedData.perfId && !dataFetched) {
      await fetchDataForCurrentPerformance();
    }
  };

  const canAccessTab = (_tabId: string) => true;

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
          {TABS.map((tab) => {
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
                      ? `bg-${tab.color}-600 text-white shadow-md` 
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
        {activeTab === 'new-performance' && (
          <NewPerformanceTestTab
            onSubmit={handleNewPerformanceSubmit}
            loading={loading}
            sharedData={sharedData}
          />
        )}
        {activeTab === 'save-data' && (
          <SaveDataTab
            data={data}
            pagination={apiResponse.pagination}
            filters={apiResponse.filters}
            sort={apiResponse.sort}
            loading={loading}
            onDataUpdate={handleDataUpdate}
            sharedData={sharedData}
          />
        )}
        {activeTab === 'tab1' && (
          <Tab1Provider sharedData={sharedData} inputTagsData={apiResponse.input_tags?.tab1}>
            <Tab1 
              sharedData={sharedData} 
              inputTagsData={apiResponse.input_tags?.tab1}
            />
          </Tab1Provider>
        )}
        {activeTab === 'run' && <RunTab />}
        {activeTab === 'tab2' && (
          <Tab2Provider sharedData={sharedData} inputTagsData={apiResponse.input_tags?.tab2}>
            <Tab2 
              sharedData={sharedData}
              inputTagsData={apiResponse.input_tags?.tab2}
            />
          </Tab2Provider>
        )}
        {activeTab === 'tab3' && (
          <Tab3Provider sharedData={sharedData} inputTagsData={apiResponse.input_tags?.tab3}>
            <Tab3 
              sharedData={sharedData}
              inputTagsData={apiResponse.input_tags?.tab3}
            />
          </Tab3Provider>
        )}
      </div>
    </div>
  );
} 