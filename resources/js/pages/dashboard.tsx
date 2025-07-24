import { Chart } from '@/components/ui/chart';
import { ChartCard } from '@/components/ui/chart-card';
import { StatsCard } from '@/components/ui/stats-card';
import { useTheme } from '@/contexts/ThemeContext';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ChartData } from 'chart.js';
import { AlertTriangle, Gauge, LineChart, Thermometer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data - replace with real data from your API
const stats = [
    {
        title: 'Total Anomalies',
        value: 24,
        icon: AlertTriangle,
        trend: { value: 12, label: 'vs last month', isPositive: false },
    },
    {
        title: 'Average Heat Rate',
        value: '2,345 kCal/kWh',
        icon: Thermometer,
        trend: { value: 4, label: 'vs target', isPositive: true },
    },
    {
        title: 'System Efficiency',
        value: '89.5%',
        icon: Gauge,
        trend: { value: 2.1, label: 'vs last week', isPositive: true },
    },
];

export default function Dashboard() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Mock chart data - replace with real data from your API
    const anomalyTrendData: ChartData<'line'> = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Anomalies',
                data: [12, 19, 15, 24, 18, 24],
                borderColor: isDark ? '#94a3b8' : '#64748b',
                backgroundColor: isDark ? '#94a3b820' : '#64748b20',
                tension: 0.4,
            },
        ],
    };

    const heatRateData: ChartData<'bar'> = {
        labels: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4'],
        datasets: [
            {
                label: 'Heat Rate (kCal/kWh)',
                data: [2345, 2400, 2290, 2380],
                backgroundColor: isDark ? '#94a3b8' : '#64748b',
            },
        ],
    };

    const efficiencyData: ChartData<'line'> = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Efficiency (%)',
                data: [88, 89.5, 89.2, 90.1, 89.8, 89.5, 89.9],
                borderColor: isDark ? '#94a3b8' : '#64748b',
                backgroundColor: isDark ? '#94a3b820' : '#64748b20',
                tension: 0.4,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Performance Test - Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <StatsCard key={stat.title} {...stat} />
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <ChartCard title="Anomaly Trend" description="Number of anomalies detected over time" icon={LineChart} className="md:col-span-2">
                        <Chart type="line" data={anomalyTrendData} className="h-[300px] w-full" />
                    </ChartCard>
                    <ChartCard title="Heat Rate Distribution" description="Distribution of heat rates across units">
                        <Chart type="bar" data={heatRateData} className="h-[300px] w-full" />
                    </ChartCard>
                    <ChartCard title="Efficiency Analysis" description="System efficiency breakdown">
                        <Chart type="line" data={efficiencyData} className="h-[300px] w-full" />
                    </ChartCard>
                </div>
            </div>
        </AppLayout>
    );
}
