import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Search } from 'lucide-react';
import { CalendarComponent } from '@/components/calendar-component';

interface DataAnalysisFormProps {
  onSubmit: (data: { description: string; dateTime: string }) => void;
  loading: boolean;
}

export function DataAnalysisForm({ onSubmit, loading }: DataAnalysisFormProps) {
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close calendar when clicking outside or repositioning on scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    const handleScroll = () => {
      if (showCalendar && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const calendarWidth = 400; // Approximate width of calendar
        
        // Check if calendar would go beyond right edge of viewport
        let left = rect.left + window.scrollX;
        if (left + calendarWidth > window.innerWidth) {
          left = rect.right + window.scrollX - calendarWidth;
        }
        
        setCalendarPosition({
          top: rect.bottom + window.scrollY + 5,
          left: Math.max(10, left) // Ensure at least 10px from left edge
        });
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      handleScroll(); // Initial position calculation
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showCalendar]);

  // Calculate max datetime (current time minus 2 hours, rounded down)
  const getMaxDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() - 2); // Subtract 2 hours
    now.setMinutes(0); // Round down to the hour
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:00`;
  };

  const handleCalendarSelect = (selectedDate: Date) => {
    // Format the date to match datetime-local format
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const hours = String(selectedDate.getHours()).padStart(2, '0');
    const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    setDateTime(formattedDateTime);
    setShowCalendar(false); // Close the calendar popup
  };

  const handleCalendarIconClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const calendarWidth = 400; // Approximate width of calendar
      
      // Check if calendar would go beyond right edge of viewport
      let left = rect.left + window.scrollX;
      if (left + calendarWidth > window.innerWidth) {
        left = rect.right + window.scrollX - calendarWidth;
      }
      
      setCalendarPosition({
        top: rect.bottom + window.scrollY + 5, // 5px gap below button
        left: Math.max(10, left) // Ensure at least 10px from left edge
      });
    }
    setShowCalendar(!showCalendar); // Toggle calendar
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      setDescriptionError('Description is required');
      return;
    } else {
      setDescriptionError('');
    }
    if (!dateTime) {
      alert('Please select date and time');
      return;
    }

    // Validate that selected time is not in the future beyond the allowed limit
    const selectedDate = new Date(dateTime);
    const maxDate = new Date(getMaxDateTime());
    
    if (selectedDate > maxDate) {
      alert('Selected time cannot be later than ' + maxDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
      return;
    }

    onSubmit({ description: description.trim(), dateTime });
  };

  return (
    <>
      <div className="mb-6 rounded-b-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-foreground dark:text-white mb-4">Analysis Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description Field */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter analysis description..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-background dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/70 resize-none ${descriptionError ? 'border-red-500' : 'border-input dark:border-input/30'}`}
                />
                {descriptionError && (
                  <span className="text-xs text-red-500 mt-1">{descriptionError}</span>
                )}
              </div>
            </div>

            {/* Date and Time Field */}
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Performance Date & Time
              </label>
              <div className="relative">
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={handleCalendarIconClick}
                  className="flex items-center gap-2 px-3 py-2 border border-input dark:border-input/30 rounded-lg text-sm bg-background dark:bg-gray-700 text-foreground dark:text-white hover:border-primary dark:hover:border-primary/70 transition-colors w-full"
                >
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1 text-left">
                    {dateTime ? new Date(dateTime).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }) : 'Select date and time'}
                  </span>
                </button>
              </div>
              
              {/* Calendar Dropdown */}
              {showCalendar && createPortal(
                <div 
                  ref={calendarRef}
                  className="fixed z-[9999]"
                  style={{
                    top: `${calendarPosition.top}px`,
                    left: `${calendarPosition.left}px`
                  }}
                >
                  <CalendarComponent
                    onDateTimeSelect={handleCalendarSelect}
                    value={dateTime}
                  />
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* Get Data Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={loading || !description.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 dark:hover:bg-primary/80 disabled:bg-gray-400 text-primary-foreground rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Get Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 