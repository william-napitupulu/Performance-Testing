import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Performance } from '@/data/mockPerformanceData';
import { PerformanceListContainer } from '@/components/project-components/PerformanceListComponents/PerformanceListContainer';

interface PerformanceListProps {
  performances: Performance[];
  selectedUnit: number;
  selectedUnitName?: string;
  error?: string;
}

export default function PerformanceList({ 
  performances: initialPerformances = [], 
  selectedUnit, 
  selectedUnitName, 
  error 
}: PerformanceListProps) {
  return (
    <AppLayout>
      <Head title="Performance Test - Performance List" />
      <PerformanceListContainer
        initialPerformances={initialPerformances}
        selectedUnit={selectedUnit}
        selectedUnitName={selectedUnitName}
        error={error}
      />
    </AppLayout>
  );
}
