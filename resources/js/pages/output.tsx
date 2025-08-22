import { OutputContainer } from '@/components/project-components/OutputComponents/OutputContainer';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Output() {
    return (
        <AppLayout>
            <Head title="Performance Test - Data Analysis" />
            <OutputContainer />
        </AppLayout>
    );
}
