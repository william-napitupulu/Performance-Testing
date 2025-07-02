import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarComponentProps {
  onDateTimeSelect?: (dateTime: Date) => void;
  value?: string;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateTimeSelect, value }) => {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDateTime, setSelectedDateTime] = useState<{
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  }>({
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
    hour: today.getHours(),
    minute: Math.floor(today.getMinutes() / 5) * 5
  });

  // Initialize with existing value if provided
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDateTime({
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes()
        });
        setCurrentMonth(date);
      }
    }
  }, [value]);

  // Get days in month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date(today));
    setSelectedDateTime({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
      hour: today.getHours(),
      minute: Math.floor(today.getMinutes() / 5) * 5
    });
  };

  // Check if a date is selected
  const isSelected = (year: number, month: number, day: number): boolean => {
    if (!selectedDateTime) return false;
    
    return selectedDateTime.year === year && 
           selectedDateTime.month === month && 
           selectedDateTime.day === day;
  };

  // Handle date selection
  const selectDate = (year: number, month: number, day: number) => {
    setSelectedDateTime({
      year,
      month,
      day,
      hour: selectedDateTime.hour,
      minute: selectedDateTime.minute
    });
  };

  // Handle time selection
  const handleTimeChange = (field: 'hour' | 'minute', value: number) => {
    setSelectedDateTime(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle final selection
  const handleSelection = () => {
    if (!selectedDateTime) {
      alert('Please select a date first');
      return;
    }
    
    const finalDateTime = new Date(
      selectedDateTime.year,
      selectedDateTime.month,
      selectedDateTime.day,
      selectedDateTime.hour,
      selectedDateTime.minute
    );
    
    if (onDateTimeSelect) {
      onDateTimeSelect(finalDateTime);
    }
  };

  return (
    <div className="calendar-container bg-card dark:bg-gray-800 rounded-xl w-[300px] overflow-hidden shadow-lg border border-border dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white p-3">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="w-full py-1.5 px-3 bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/20 rounded-lg transition-colors text-sm font-medium text-white"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-3">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => (
            <div key={`empty-${i}`} className="h-5" />
          ))}

          {/* Actual days */}
          {Array.from({ length: getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => {
            const day = i + 1;
            const isToday = 
              currentMonth.getFullYear() === today.getFullYear() &&
              currentMonth.getMonth() === today.getMonth() &&
              day === today.getDate();

            return (
              <button
                key={day}
                onClick={() => selectDate(currentMonth.getFullYear(), currentMonth.getMonth(), day)}
                className={`
                  h-7 rounded-lg text-xs font-medium transition-colors
                  ${isSelected(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                    ? 'bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 shadow-md'
                    : isToday
                      ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-500'
                      : 'text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Time Selection */}
        <div className="mt-3 p-3 border-t border-border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <select
                value={selectedDateTime.hour}
                onChange={(e) => handleTimeChange('hour', parseInt(e.target.value))}
                className="w-16 rounded-lg border border-input dark:border-gray-600 bg-background dark:bg-gray-700 dark:text-gray-200 px-2 py-1.5 text-sm"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i} className="dark:bg-gray-700">{String(i).padStart(2, '0')}</option>
                ))}
              </select>
              <span className="text-foreground dark:text-gray-300">:</span>
              <select
                value={selectedDateTime.minute}
                onChange={(e) => handleTimeChange('minute', parseInt(e.target.value))}
                className="w-16 rounded-lg border border-input dark:border-gray-600 bg-background dark:bg-gray-700 dark:text-gray-200 px-2 py-1.5 text-sm"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const value = i * 5;
                  return (
                    <option key={value} value={value} className="dark:bg-gray-700">{String(value).padStart(2, '0')}</option>
                  );
                })}
              </select>
            </div>
            <button
              onClick={handleSelection}
              className="px-4 py-1.5 bg-gray-700 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 rounded-lg text-sm font-medium transition-colors shadow-md"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 