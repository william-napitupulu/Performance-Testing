import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { DataAnalysisContainer } from '@/components/project-components/DataAnalysisComponents/DataAnalysisContainer';

export default function DataAnalysis() {
  return (
    <AppLayout>
      <Head title="Performance Test - Data Analysis" />
      <DataAnalysisContainer />
    </AppLayout>
  );
} 