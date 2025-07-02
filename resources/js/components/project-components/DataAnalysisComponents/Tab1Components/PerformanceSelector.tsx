import React from 'react';

interface PerformanceRecord {
  perf_id: number;
  description: string;
  date_perfomance: string;
  formatted_label: string;
}

interface PerformanceSelectorProps {
  performanceRecords: PerformanceRecord[];
  selectedPerfId: number | null;
  onSelect: (perfId: number) => void;
}

export const PerformanceSelector: React.FC<PerformanceSelectorProps> = ({ performanceRecords, selectedPerfId, onSelect }) => {
  if (performanceRecords.length === 0) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Existing Performance Test
      </label>
      <select
        value={selectedPerfId ?? ''}
        onChange={(e) => onSelect(parseInt(e.target.value, 10))}
        className="w-full px-3 py-2 border border-input dark:border-input/30 rounded bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/70"
      >
        <option value="">-- Select Performance Test --</option>
        {performanceRecords.map((perf) => (
          <option key={perf.perf_id} value={perf.perf_id}>
            {perf.formatted_label}
          </option>
        ))}
      </select>
    </div>
  );
}; 