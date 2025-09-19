import { BaselineDetailsContainer } from '@/components/project-components/BaselineDetailsComponents/BaselineDetailsContainer';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Baseline } from '@/data/baselineData'; // Import your Baseline type

interface BaselineDetailsPageProps {
    baseline: Baseline; // This will contain the baseline and its details
}

export default function BaselineDetailsPage({ baseline }: BaselineDetailsPageProps) {
    return (
        <AppLayout>
            <Head title={`Baseline Details - ${baseline.description}`} />
            <BaselineDetailsContainer baseline={baseline} />
        </AppLayout>
    );
}