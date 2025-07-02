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
  if (!sharedData.dateTime) return null;

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