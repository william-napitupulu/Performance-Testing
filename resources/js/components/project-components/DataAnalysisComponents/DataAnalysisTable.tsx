import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AnalysisData } from './types';

interface DataAnalysisTableProps {
  data: AnalysisData[];
  analysisInfo: {
    id: string;
    description: string;
    dateTime: string;
  };
}

export function DataAnalysisTable({ data, analysisInfo }: DataAnalysisTableProps) {
  const formatGap = (gap: number) => {
    const isPositive = gap > 0;
    const isNegative = gap < 0;
    
    let icon;
    let colorClass;
    let bgClass;
    
    if (isPositive) {
      icon = <TrendingUp className="h-3 w-3" />;
      colorClass = 'text-green-700 dark:text-green-300';
      bgClass = 'bg-green-100 dark:bg-green-900/30';
    } else if (isNegative) {
      icon = <TrendingDown className="h-3 w-3" />;
      colorClass = 'text-red-700 dark:text-red-300';
      bgClass = 'bg-red-100 dark:bg-red-900/30';
    } else {
      icon = <Minus className="h-3 w-3" />;
      colorClass = 'text-gray-700 dark:text-gray-300';
      bgClass = 'bg-gray-100 dark:bg-gray-800';
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${bgClass}`}>
        {icon}
        {gap > 0 ? '+' : ''}{gap}
      </span>
    );
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-border dark:border-gray-600">
        <h3 className="text-lg font-medium text-foreground dark:text-white">Analysis Results</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          ID: {analysisInfo.id} | Description: {analysisInfo.description} | Date: {new Date(analysisInfo.dateTime).toLocaleString()}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Parameter
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                UOM
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reference Data
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Existing Data
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Gap Analysis
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-gray-700">
            {data.map((row, index) => (
              <tr key={row.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-green-50 dark:hover:bg-gray-600 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {row.no}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                  {row.parameter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 text-center">
                  {row.uom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-mono">
                  {row.referenceData.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right font-mono">
                  {row.existingData.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {formatGap(row.gap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 