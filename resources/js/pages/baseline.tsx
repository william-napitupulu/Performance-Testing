import { BaselineContainer } from '@/components/project-components/BaselineComponents/BaselineContainer';
import { Baseline } from '@/data/baselineData';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface BaselineListProps {
    baselines: Baseline[];
    selectedUnit: number;
    selectedUnitName?: string;
    error?: string;
}

export default function BaselineList({ baselines: initialBaselines = [], selectedUnit, selectedUnitName, error }: BaselineListProps) {
    return (
        <AppLayout>
            <Head title="Baseline - Baseline List" />
            <BaselineContainer
                initialBaselines={initialBaselines}
                selectedUnit={selectedUnit}
                selectedUnitName={selectedUnitName}
                error={error}
            />
        </AppLayout>
    );
}
