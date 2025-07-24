import { DataAnalysisContainer } from '@/components/project-components/DataAnalysisComponents/DataAnalysisContainer';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function DataAnalysis() {
    return (
        <AppLayout>
            <Head title="Performance Test - Data Analysis" />
            <DataAnalysisContainer />
        </AppLayout>
    );
}
