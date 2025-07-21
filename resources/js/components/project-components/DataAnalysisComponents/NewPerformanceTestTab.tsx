import React from 'react';
import { DataAnalysisForm } from './DataAnalysisForm';
import { Plus, CheckCircle, Calendar, Hash, FileText } from 'lucide-react';

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
}

interface NewPerformanceTestTabProps {
  onSubmit: (data: { description: string; dateTime: string; type: string; weight: string }) => void;
  loading: boolean;
  sharedData: SharedPerformanceData;
}

export function NewPerformanceTestTab({
  onSubmit,
  loading,
  sharedData
}: NewPerformanceTestTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden rounded-b-lg">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-b-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Create New Performance Test
              </h2>
              <p className="text-blue-100 text-sm">
                Set up a new performance test with custom parameters and configurations
              </p>
            </div>
          </div>
        </div>

        {/* Current Performance Test Info */}
        {sharedData.dateTime && (
          <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500 dark:border-emerald-400">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                  Active Performance Test
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                  A performance test is currently active with the following configuration:
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Description */}
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Test Description
                </h4>
                <p className="text-gray-900 dark:text-gray-100 text-base leading-relaxed">
                  {sharedData.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                        Date & Time
                      </h5>
                      <p className="text-purple-900 dark:text-purple-100 font-medium">
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
                          hour12: false
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {sharedData.perfId && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                          Performance ID
                        </h5>
                        <p className="text-blue-900 dark:text-blue-100 font-mono text-sm font-semibold">
                          {sharedData.perfId}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <DataAnalysisForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
} 