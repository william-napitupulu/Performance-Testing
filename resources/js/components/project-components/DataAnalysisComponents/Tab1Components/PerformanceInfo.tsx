import React from 'react';
import { AlertTriangle, Info, Calendar, Hash } from 'lucide-react';

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
}

interface PerformanceInfoProps {
  sharedData: SharedPerformanceData;
}

export const PerformanceInfo: React.FC<PerformanceInfoProps> = ({ sharedData }) => {
  if (!sharedData.dateTime) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-4 border-orange-500 dark:border-orange-400">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-200">
              No Performance Test Selected
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              Please choose a performance from the Performance List or create a new one to begin your analysis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden rounded-b-lg">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-b-lg">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Performance Test Details
              </h2>

            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Test Description
              </h3>
              <p className="text-gray-900 dark:text-gray-100 text-base leading-relaxed">
                {sharedData.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date/Time */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                      Date & Time
                    </h4>
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

              {/* Performance ID */}
              {sharedData.perfId && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                        <Hash className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                        Performance ID
                      </h4>
                      <p className="text-emerald-900 dark:text-emerald-100 font-mono text-sm font-semibold">
                        {sharedData.perfId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 