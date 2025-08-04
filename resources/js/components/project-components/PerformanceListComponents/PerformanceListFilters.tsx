import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Performance } from '@/data/mockPerformanceData';
import { useEffect, useRef, useState } from 'react';
import { CalendarDropdown } from './CalendarDropdown';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchValues {
    id: string;
    description: string;
    status: string;
    date_perfomance: string;
    date_created: string;
    unit_name: string;
    type: string;
    weight: string;
}

interface PerformanceListFiltersProps {
    filters: {
        search?: string;
        status?: string;
        date_perfomance?: string;
        date_created?: string;
        unit_name?: string;
        type?: string;
        weight?: string;
    };
}

export function PerformanceListFilters({ filters }: PerformanceListFiltersProps) {
    const [localFilters, setLocalFilters] = useState(filters);
    const debouncedFilters = useDebounce(localFilters, 300);

    useEffect(() => {
        router.get(window.location.pathname, debouncedFilters, {
            preserveState: true,
            replace: true,
        });
    }, [debouncedFilters]);

    const handleChange = (field: keyof typeof localFilters, value: string) => {
        setLocalFilters((prev) => ({
            ...prev,
            [field]: value,
            page: 1,
        }));
    };

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);


    return (
        <tr className="overflow-visible border-b bg-blue-50/30 dark:border-gray-800 dark:bg-blue-900/10">
            <td className="w-30 px-4 py-3">
                <Input
                    type="text"
                    value={localFilters.search || ''}
                    onChange={(e) => handleChange('search', e.target.value)}
                    placeholder="Search All..."
                    className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
            </td>
            <td className="px-6 py-3">
                <Input
                    type="text"
                    value={localFilters.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Search description..."
                    className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
            </td>
            <td className="px-6 py-3">
                <Select value={searchValues.status || 'all'} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Editable">Editable</SelectItem>
                        <SelectItem value="Locked">Locked</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="overflow-visible px-6 py-3">
                <CalendarDropdown
                    value={searchValues.date_perfomance}
                    placeholder="Select performance date..."
                    onChange={(date) => handleChange('date_perfomance', date)}
                />
            </td>
            <td className="overflow-visible px-6 py-3">
                <CalendarDropdown
                    value={searchValues.date_created}
                    placeholder="Select created date..."
                    onChange={(date) => handleChange('date_created', date)}
                />
            </td>
            <td className="px-6 py-3">
                <Input
                    type="text"
                    value={searchValues.unit_name}
                    onChange={(e) => handleChange('unit_name', e.target.value)}
                    placeholder="Search unit name..."
                    className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
            </td>
            <td className="px-6 py-3">
                <Select value={searchValues.type || 'all'} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Rutin">Rutin</SelectItem>
                        <SelectItem value="Sebelum OH">Sebelum OH</SelectItem>
                        <SelectItem value="Paska OH">Paska OH</SelectItem>
                        <SelectItem value="Puslitbang">Puslitbang</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="px-6 py-3">
                <Select value={searchValues.weight || 'all'} onValueChange={(value) => handleChange('weight', value)}>
                    <SelectTrigger className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400">
                        <SelectValue placeholder="All Weights" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Weights</SelectItem>
                        <SelectItem value="Beban 1">Beban 1</SelectItem>
                        <SelectItem value="Beban 2">Beban 2</SelectItem>
                        <SelectItem value="Beban 3">Beban 3</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="px-6 py-3">{/* Actions column - empty for search row */}</td>
        </tr>
    );
}
