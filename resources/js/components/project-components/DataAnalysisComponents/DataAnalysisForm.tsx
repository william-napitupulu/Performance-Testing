import { CalendarComponent } from '@/components/calendar-component';
import { Calendar, FileText, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DataAnalysisFormProps {
    onSubmit: (data: { description: string; dateTime: string; type: string; weight: string }) => void;
    loading: boolean;
}

export function DataAnalysisForm({ onSubmit, loading }: DataAnalysisFormProps) {
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [dateTimeError, setDateTimeError] = useState('');
    const [type, setType] = useState('');
    const [typeError, setTypeError] = useState('');
    const [weight, setWeight] = useState('');
    const [weightError, setWeightError] = useState('');
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
                    top: rect.bottom,
                    left: Math.max(10, left), // Ensure at least 10px from left edge
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

    // Helper function to validate date format
    const isValidDateTime = (dateString: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime()) && date.getTime() > 0;
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
        setDateTimeError(''); // Clear any previous error
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
                left: Math.max(10, left), // Ensure at least 10px from left edge
            });
        }
        setShowCalendar(!showCalendar); // Toggle calendar
    };

    const handleSubmit = () => {
        let hasErrors = false;

        // Validate description
        if (!description.trim()) {
            setDescriptionError('Description is required');
            hasErrors = true;
        } else {
            setDescriptionError('');
        }

        // Validate type
        if (!type) {
            setTypeError('Type is required');
            hasErrors = true;
        } else {
            setTypeError('');
        }

        // Validate weight
        if (!weight) {
            setWeightError('Weight is required');
            hasErrors = true;
        } else {
            setWeightError('');
        }

        // Validate date/time
        if (!dateTime) {
            setDateTimeError('Please select date and time');
            hasErrors = true;
        } else if (!isValidDateTime(dateTime)) {
            setDateTimeError('Please select a valid date and time');
            hasErrors = true;
        } else {
            setDateTimeError('');

            // Validate that selected time is not in the future beyond the allowed limit
            const selectedDate = new Date(dateTime);
            const maxDate = new Date(getMaxDateTime());

            if (selectedDate > maxDate) {
                setDateTimeError(
                    'Selected time cannot be later than ' +
                        maxDate.toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }),
                );
                hasErrors = true;
            }
        }

        if (hasErrors) {
            return;
        }

        onSubmit({
            description: description.trim(),
            dateTime,
            type,
            weight,
        });
    };

    return (
        <>
            <div className="mb-6 overflow-hidden rounded-b-lg border border-border bg-card shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="p-6">
                    <h3 className="mb-6 flex items-center gap-2 text-lg font-medium text-foreground dark:text-white">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        Analysis Parameters
                    </h3>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Description Field */}
                        <div className="space-y-3">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-white">
                                Description
                            </label>
                            <div className="relative">
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter a detailed description of your performance test..."
                                    className={`w-full resize-none rounded-lg border bg-background px-4 py-3 text-sm text-foreground placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                                        descriptionError
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-input hover:border-gray-400 dark:border-input/30 dark:hover:border-gray-500'
                                    }`}
                                />
                                {description && (
                                    <div className="absolute top-3 right-3">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    </div>
                                )}
                            </div>
                            {descriptionError && (
                                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                        <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></span>
                                    </div>
                                    {descriptionError}
                                </div>
                            )}
                        </div>

                        {/* Date/Time and Number Input */}
                        <div className="space-y-4">
                            {/* Date Time Field */}
                            <div className="space-y-3">
                                <label htmlFor="datetime" className="block text-sm font-semibold text-gray-700 dark:text-white">
                                    Performance Date & Time
                                </label>
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        type="button"
                                        onClick={handleCalendarIconClick}
                                        className={`flex w-full items-center gap-3 rounded-lg border bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:hover:border-blue-500 ${
                                            dateTimeError
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-input dark:border-input/30'
                                        }`}
                                    >
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                        <span className="flex-1 text-left">
                                            {dateTime ? (
                                                <span className="text-gray-900 dark:text-white">
                                                    {new Date(dateTime).toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false,
                                                    })}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">Select date and time</span>
                                            )}
                                        </span>
                                        {dateTime && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                                    </button>
                                    {dateTimeError && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                                <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></span>
                                            </div>
                                            {dateTimeError}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Type Field */}
                            <div className="space-y-3">
                                <label htmlFor="type" className="block text-sm font-semibold text-black dark:text-white">
                                    Type
                                </label>
                                <div className="relative">
                                    <select
                                        id="type"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className={`w-full rounded-lg border bg-background px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 ${
                                            type ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                        } ${
                                            typeError
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-input hover:border-gray-400 dark:border-input/30 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <option value="">Select type...</option>
                                        <option value="Rutin">Rutin</option>
                                        <option value="Sebelum OH">Sebelum OH</option>
                                        <option value="Paska OH">Paska OH</option>
                                        <option value="Puslitbang">Puslitbang</option>
                                    </select>
                                    {type && (
                                        <div className="absolute top-3 right-3">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                    )}
                                </div>
                                {typeError && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                            <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></span>
                                        </div>
                                        {typeError}
                                    </div>
                                )}
                            </div>

                            {/* Weight Field */}
                            <div className="space-y-3">
                                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 dark:text-white">
                                    Weight
                                </label>
                                <div className="relative">
                                    <select
                                        id="weight"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className={`w-full rounded-lg border bg-background px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 ${
                                            weight ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                        } ${
                                            weightError
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-input hover:border-gray-400 dark:border-input/30 dark:hover:border-gray-500'
                                        }`}
                                    >
                                        <option value="">Select weight...</option>
                                        <option value="Beban 1">Beban 1</option>
                                        <option value="Beban 2">Beban 2</option>
                                        <option value="Beban 3">Beban 3</option>
                                    </select>
                                    {weight && (
                                        <div className="absolute top-3 right-3">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                    )}
                                </div>
                                {weightError && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                                            <span className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></span>
                                        </div>
                                        {weightError}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !description.trim() || !type || !weight}
                            className="relative flex min-w-[220px] transform items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="h-5 w-5" />
                                    <span>Create Performance Test</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Portal */}
            {showCalendar &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={calendarRef}
                        className="fixed z-50 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
                        style={{
                            top: calendarPosition.top,
                            left: calendarPosition.left,
                        }}
                    >
                        <CalendarComponent onDateTimeSelect={handleCalendarSelect} value={dateTime} />
                    </div>,
                    document.body,
                )}
        </>
    );
}
