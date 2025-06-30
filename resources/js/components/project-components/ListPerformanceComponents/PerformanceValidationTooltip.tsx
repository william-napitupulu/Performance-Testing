import React from 'react';

interface PerformanceValidationTooltipProps {
  show: boolean;
  message: string;
  className?: string;
}

export const PerformanceValidationTooltip: React.FC<PerformanceValidationTooltipProps> = ({
  show,
  message,
  className = ''
}) => {
  if (!show) return null;

  return (
    <div className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm tooltip dark:bg-red-700 ${className}`}>
      {message}
      <div className="tooltip-arrow" data-popper-arrow></div>
    </div>
  );
}; 