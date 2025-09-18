import { Input } from '@/components/ui/input';
import { Baseline } from '@/data/baselineData';
import { useEffect, useState } from 'react';


interface BaselineFiltersProps {
    allData: Baseline[];
    onFilteredDataChange: (data: Baseline[]) => void;
}

export function BaselineFilters({ allData, onFilteredDataChange }: BaselineFiltersProps) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = allData.filter((baseline) => {
            const descriptionMatch = baseline.description.toLowerCase().includes(lowercasedTerm);
            const notesMatch = baseline.keterangan?.toLowerCase().includes(lowercasedTerm) || false;
            return descriptionMatch || notesMatch;
        });
        onFilteredDataChange(filtered);
    }, [searchTerm, allData, onFilteredDataChange]);

    return (
        <tr className="bg-gray-50 dark:bg-gray-800">
            <td className="px-6 py-3" colSpan={6}>
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by description or notes..."
                    className="w-full"
                />
            </td>
        </tr>
    );
}
