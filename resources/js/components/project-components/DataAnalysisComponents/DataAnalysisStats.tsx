import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AnalysisData } from './types';

interface DataAnalysisStatsProps {
  data: AnalysisData[];
}

export function DataAnalysisStats({ data }: DataAnalysisStatsProps) {
  const positiveGaps = data.filter(item => item.gap > 0).length;
  const negativeGaps = data.filter(item => item.gap < 0).length;
  const averageGap = data.length > 0 ? 
    (data.reduce((sum, item) => sum + item.gap, 0) / data.length).toFixed(1) : '0.0';

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Parameters</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Positive Gaps</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{positiveGaps}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Negative Gaps</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{negativeGaps}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Minus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Gap</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{averageGap}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 