import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { CalendarComponent } from '@/components/calendar-component';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import type { SearchFilters } from './types';
import { createPortal } from 'react-dom';

interface DataAnalysisSearchFiltersProps {
  searchValues: SearchFilters;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
}

export function DataAnalysisSearchFilters({
  searchValues,
  onFilterChange
}: DataAnalysisSearchFiltersProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [uniqueId] = useState(() => Math.random().toString(36).substring(7));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    const handleScroll = () => {
      if (showCalendar && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const calendarWidth = 400;
        
        let left = rect.left + window.scrollX;
        if (left + calendarWidth > window.innerWidth) {
          left = window.innerWidth - calendarWidth - 10;
        }
        
        setCalendarPosition({
          top: rect.bottom + window.scrollY + 5,
          left: Math.max(10, left)
        });
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      handleScroll();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showCalendar]);

  const handleCalendarIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const calendarWidth = 400;
      
      let left = rect.left + window.scrollX;
      if (left + calendarWidth > window.innerWidth) {
        left = window.innerWidth - calendarWidth - 10;
      }
      
      setCalendarPosition({
        top: rect.bottom + window.scrollY + 5,
        left: Math.max(10, left)
      });
      setShowCalendar(!showCalendar);
    }
  };

  const handleCalendarSelect = (selectedDate: Date) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const hours = String(selectedDate.getHours()).padStart(2, '0');
    const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    onFilterChange({ date_from: formattedDateTime });
    setShowCalendar(false);
  };

  return (
    <tr className="bg-blue-50/30 dark:bg-blue-900/10">
      <td className="px-4 py-2">
        <input
          type="text"
          placeholder="Search ID..."
          className="w-full px-3 py-1.5 text-[11px] bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={searchValues.tag_no}
          onChange={(e) => onFilterChange({ tag_no: e.target.value })}
        />
      </td>
      <td className="px-6 py-2">
        <input
          type="text"
          placeholder="Search Tag No..."
          className="w-full px-3 py-1.5 text-[11px] bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={searchValues.tag_no}
          onChange={(e) => onFilterChange({ tag_no: e.target.value })}
        />
      </td>
      <td className="px-6 py-2">
        <input
          type="number"
          step="any"
          placeholder="Search Value..."
          className="w-full px-3 py-1.5 text-[11px] bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          value={searchValues.value_min}
          onChange={(e) => onFilterChange({ value_min: e.target.value })}
        />
      </td>
      <td className="px-6 py-2">
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleCalendarIconClick}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-md hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-left"
          >
            <Calendar className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            <span className="flex-1 truncate">
              {searchValues.date_from ? new Date(searchValues.date_from).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }) : 'Select date...'}
            </span>
          </button>

          {showCalendar && createPortal(
            <div 
              ref={calendarRef}
              className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-gray-700 p-4"
              style={{
                top: `${calendarPosition.top}px`,
                left: `${calendarPosition.left}px`,
                width: '400px'
              }}
              key={`calendar-${uniqueId}`}
            >
              <CalendarComponent
                onDateTimeSelect={handleCalendarSelect}
                value={searchValues.date_from}
              />
            </div>,
            document.body
          )}
        </div>
      </td>
    </tr>
  );
} 