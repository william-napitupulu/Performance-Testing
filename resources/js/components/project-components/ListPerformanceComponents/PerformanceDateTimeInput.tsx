import React from 'react';

interface PerformanceDateTimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  type?: 'date' | 'datetime-local';
}

export const PerformanceDateTimeInput: React.FC<PerformanceDateTimeInputProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
  placeholder = '',
  type = 'date'
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
        disabled 
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400' 
          : 'bg-white dark:bg-gray-700'
      } ${className}`}
    />
  );
}; 