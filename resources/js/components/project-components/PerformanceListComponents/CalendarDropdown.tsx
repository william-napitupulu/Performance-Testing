import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarComponent } from '@/components/calendar-component';
import { Input } from '@/components/ui/input';

interface CalendarDropdownProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export const CalendarDropdown: React.FC<CalendarDropdownProps> = ({ value, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  const handleSelect = (date: string) => {
    onChange(date);
    close();
  };

  useEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly
        onClick={() => setOpen(true)}
        className="w-full text-[11px] bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      {open && createPortal(
        <div ref={dropdownRef} style={{ position: 'absolute', top: coords.top, left: coords.left, zIndex: 1000 }}>
          <CalendarComponent
            dateOnly
            value={value}
            onDateSelect={handleSelect}
            onClear={() => {
              onChange('');
              close();
            }}
          />
         
        </div>,
        document.body
      )}
    </>
  );
}; 