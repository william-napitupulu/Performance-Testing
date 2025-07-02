import { Play } from 'lucide-react';

interface RunTabProps {
  onRunAnalysis?: () => void;
}

export function RunTab({ onRunAnalysis }: RunTabProps) {
  const handleRunAnalysis = () => {
    if (onRunAnalysis) {
      onRunAnalysis();
    } else {
      alert('Run Analysis functionality will be implemented here!');
    }
  };

  return (
    <div className="rounded-b-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">Run Analysis</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Execute the complete analysis process with all configured parameters.
      </p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-foreground dark:text-white mb-2">Analysis Summary</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Review your configuration from all tabs before running the analysis.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleRunAnalysis}
            className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
          >
            <Play className="h-6 w-6" />
            Run Analysis
          </button>
        </div>
      </div>
    </div>
  );
} 