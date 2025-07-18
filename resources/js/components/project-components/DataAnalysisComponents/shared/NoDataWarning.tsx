import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NoDataWarningProps {
  mInput: number;
  isVisible: boolean;
  customMessage?: string;
}

export const NoDataWarning: React.FC<NoDataWarningProps> = ({ 
  mInput, 
  isVisible, 
  customMessage 
}) => {
  if (!isVisible) return null;

  const defaultMessage = `No input tags found for Tab ${mInput} (m_input = ${mInput}). There may be no data available for this configuration.`;
  
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-4 border-orange-500 dark:border-orange-400">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-orange-800 dark:text-orange-200">
            No Data Available
          </h3>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
            {customMessage || defaultMessage}
          </p>
        </div>
      </div>
    </div>
  );
}; 