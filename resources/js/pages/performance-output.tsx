import { PerformanceOutputContainer } from '@/components/project-components/PerformanceOutputComponents/PerformanceOutputContainer';
import { Performance } from '@/data/mockPerformanceData';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface PerformanceListProps {
    performances: Performance[];
    selectedUnit: number;
    selectedUnitName?: string;
    error?: string;
}

export default function PerformancesOutput({ performances: initialPerformances = [], selectedUnit, selectedUnitName, error }: PerformanceListProps) {
    return (
        <AppLayout>
            <Head title="Performance Test - Performance Test Output" />
            <PerformanceOutputContainer
                initialPerformances={initialPerformances}
                selectedUnit={selectedUnit}
                selectedUnitName={selectedUnitName}
                error={error}
            />
        </AppLayout>
    );
}
