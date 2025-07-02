import React, { useState } from 'react';
import { Play, Database, Settings, BarChart3, Cog, Plus } from 'lucide-react';
import { NewPerformanceTestTab } from './NewPerformanceTestTab';
import { GetDataTab } from './GetDataTab';
import { RunTab } from './RunTab';
import { Tab1 } from './Tab1';
import { Tab2 } from './Tab2';
import { Tab3 } from './Tab3';
import type { AnalysisData, ApiResponse } from './types';
import axios from 'axios';

type TabType = 'new-performance' | 'get-data' | 'tab1' | 'tab2' | 'tab3' | 'run';

const TABS = [
  { id: 'new-performance', label: 'New Performance Test', icon: Plus, color: 'blue' },
  { id: 'get-data', label: 'Get Data', icon: Database, color: 'green' },
  { id: 'tab1', label: 'Tab 1', icon: Settings, color: 'green' },
  { id: 'tab2', label: 'Tab 2', icon: BarChart3, color: 'green' },
  { id: 'tab3', label: 'Tab 3', icon: Cog, color: 'green' },
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
      value: null,
      date: null
    },
    sort: {
      field: 'no',
      direction: 'asc'
    }
  });

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
      setData(response.data.data);
      setApiResponse(response.data);
      
      // Automatically switch to Get Data tab to show results
      setActiveTab('get-data');
    } catch (error) {
      console.error('Error creating performance test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = async (params: {
    page?: number;
    sort_field?: string;
    sort_direction?: string;
    filter_tag_no?: string;
    filter_value?: string;
    filter_date?: string;
  }) => {
    try {
      const response = await axios.get('/api/data-analysis/data', { params });
      setData(response.data.data);
      setApiResponse(response.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleTabChange = (tab: TabType) => {
    // Prevent navigation to get-data tab without performance data
    if (tab === 'get-data' && !sharedData.dateTime) {
      alert('Please create a New Performance Test first');
      return;
    }
    
    setActiveTab(tab);
  };

  const canAccessTab = (tabId: string) => {
    if (tabId === 'get-data') {
      return !!sharedData.dateTime;
    }
    return true; // Tab1 is now always accessible
  };

  return (
    <div className="p-6 bg-background">
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
        {activeTab === 'get-data' && (
          <GetDataTab
            data={data}
            pagination={apiResponse.pagination}
            filters={apiResponse.filters}
            sort={apiResponse.sort}
            loading={loading}
            onSubmit={() => {}} // No form submission in this tab anymore
            onDataUpdate={handleDataUpdate}
            sharedData={sharedData}
          />
        )}
        {activeTab === 'tab1' && (
          <Tab1 sharedData={sharedData} />
        )}
        {activeTab === 'run' && <RunTab />}
        {activeTab === 'tab2' && <Tab2 />}
        {activeTab === 'tab3' && <Tab3 />}
      </div>
    </div>
  );
} 