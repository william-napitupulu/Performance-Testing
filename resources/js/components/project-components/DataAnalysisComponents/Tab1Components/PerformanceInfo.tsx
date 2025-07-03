import React from 'react';

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
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          ⚠️ No performance test selected. Please choose a performance from the Performance List or create a new one in the "New Performance Test" tab.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-blue-50/70 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/50">
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
        Current Performance Test
      </h3>
      <div className="text-sm">
        <p className="text-blue-600 dark:text-blue-400">
          <strong>Description:</strong> {sharedData.description}
        </p>
        <p className="text-blue-600 dark:text-blue-400">
          <strong>Date/Time:</strong> {new Date(sharedData.dateTime).toLocaleString()}
        </p>
        {sharedData.perfId && (
          <p className="text-blue-600 dark:text-blue-400">
            <strong>Performance ID:</strong> {sharedData.perfId}
          </p>
        )}
      </div>
    </div>
  );
}; 