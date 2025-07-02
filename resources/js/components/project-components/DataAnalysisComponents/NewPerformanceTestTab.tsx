import React from 'react';
import { DataAnalysisForm } from './DataAnalysisForm';

interface SharedPerformanceData {
  description: string;
  dateTime: string;
  perfId?: number;
}

interface NewPerformanceTestTabProps {
  onSubmit: (data: { description: string; dateTime: string }) => void;
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
      <div className="bg-blue-50/70 dark:bg-blue-900/10 rounded-lg p-6 border border-blue-100 dark:border-blue-800/50">
        <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
          New Performance Test
        </h2>
        <p className="text-blue-600 dark:text-blue-400 text-sm">
          Create a new performance test by providing a description and selecting the date/time for data collection.
          After submission, you'll be redirected to view the results.
        </p>
        {sharedData.dateTime && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800/50">
            <p className="text-green-700 dark:text-green-300 text-sm">
              ✅ Current Performance Test: <strong>{sharedData.description}</strong> 
              <br />
              📅 Date/Time: <strong>{new Date(sharedData.dateTime).toLocaleString()}</strong>
              {sharedData.perfId && (
                <>
                  <br />
                  🆔 Performance ID: <strong>{sharedData.perfId}</strong>
                </>
              )}
            </p>
          </div>
        )}
      </div>
      
      <DataAnalysisForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
} 