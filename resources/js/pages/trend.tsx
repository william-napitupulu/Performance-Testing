import { TrendContainer } from '@/components/project-components/TrendComponents/TrendContainer';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


export default function TrendChart() {
    return (
        <AppLayout>
            <Head title="Trend - Trending Chart" />
            <TrendContainer/>
        </AppLayout>
    );
}
