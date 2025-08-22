import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Performance } from '@/data/mockPerformanceData';
import { useEffect, useState } from 'react';
import { CalendarDropdown } from './CalendarDropdown';

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
    performances: Performance[];
    onFilteredDataChange: (data: Performance[]) => void;
}

export function PerformanceOutputFilters({ performances, onFilteredDataChange }: PerformanceListFiltersProps) {
    const [searchValues, setSearchValues] = useState<SearchValues>({
        id: '',
        description: '',
        status: '',
        date_perfomance: '',
        date_created: '',
        unit_name: '',
        type: '',
        weight: '',
    });

    // Get unique units for the filter
    const [unitFilter] = useState<string>('all');

    useEffect(() => {
        let filtered = [...performances];

        // Apply ID filter
        if (searchValues.id) {
            filtered = filtered.filter((performance) => performance.id.toString().includes(searchValues.id));
        }

        // Apply description filter
        if (searchValues.description) {
            filtered = filtered.filter((performance) => performance.description.toLowerCase().includes(searchValues.description.toLowerCase()));
        }

        // Apply performance date filter
        if (searchValues.date_perfomance) {
            filtered = filtered.filter((performance) => performance.date_perfomance === searchValues.date_perfomance);
        }

        // Apply unit name filter
        if (searchValues.unit_name) {
            filtered = filtered.filter((performance) => performance.unit_name?.toLowerCase().includes(searchValues.unit_name.toLowerCase()));
        }

        // Apply type filter
        if (searchValues.type && searchValues.type !== 'all') {
            filtered = filtered.filter((performance) => performance.type === searchValues.type);
        }

        // Apply unit filter
        if (unitFilter !== 'all') {
            filtered = filtered.filter((performance) => performance.unit_name === unitFilter);
        }

        onFilteredDataChange(filtered);
    }, [searchValues, unitFilter, performances, onFilteredDataChange]);

    const handleChange = (field: keyof SearchValues, value: string) => {
        setSearchValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <tr className="overflow-visible border-b bg-blue-50/30 dark:border-gray-800 dark:bg-blue-900/10">
            <td className="w-30 px-4 py-3">
                <Input
                    type="text"
                    value={searchValues.id}
                    onChange={(e) => handleChange('id', e.target.value)}
                    placeholder="Search ID..."
                    className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
            </td>
            <td className="px-6 py-3">
                <Input
                    type="text"
                    value={searchValues.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Search description..."
                    className="w-full bg-white text-[11px] focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
            </td>
            <td className="overflow-visible px-6 py-3">
                <CalendarDropdown
                    value={searchValues.date_perfomance}
                    placeholder="Select performance date..."
                    onChange={(date) => handleChange('date_perfomance', date)}
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
            <td className="px-6 py-3">{/* Actions column - empty for search row */}</td>
        </tr>
    );
}
