import { PerformanceListContainer, Paginator } from '@/components/project-components/PerformanceListComponents/PerformanceListContainer';
import { Performance } from '@/data/mockPerformanceData';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface PerformanceListProps {
    performances: Paginator<Performance>;
    selectedUnit: number;
    selectedUnitName?: string;
    error?: string;
    filters: {
        search?: string;
        sort_field: keyof Performance | null;
        sort_direction: 'asc' | 'desc';
    };
}

export default function PerformanceList({ performances, selectedUnit, selectedUnitName, error, filters }: PerformanceListProps) {
    return (
        <AppLayout>
            <Head title="Performance Test - Performance List" />
            <PerformanceListContainer
                performances={performances}
                selectedUnit={selectedUnit}
                selectedUnitName={selectedUnitName}
                error={error}
                filters={filters}
            />
        </AppLayout>
    );
}
