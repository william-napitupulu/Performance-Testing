import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ChartCard } from '@/components/ui/chart-card';
import { StatsCard } from '@/components/ui/stats-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Gauge, LineChart as LineChartIcon, Thermometer } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

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

const anomalyTrendData = [
    { month: 'Jan', anomalies: 12 },
    { month: 'Feb', anomalies: 19 },
    { month: 'Mar', anomalies: 15 },
    { month: 'Apr', anomalies: 24 },
    { month: 'May', anomalies: 18 },
    { month: 'Jun', anomalies: 24 },
];

const anomalyChartConfig =  {
    anomlies: {
        label: 'Anomalies',
        color: 'hsl(var(--chart-1))',
    },
};

const heatRateData = [
    { unit: 'Unit 1', heatRate: 2345 },
    { unit: 'Unit 2', heatRate: 2400 },
    { unit: 'Unit 3', heatRate: 2290 },
    { unit: 'Unit 4', heatRate: 2380 },
];

const heatRateChartConfig = {
    heatRate: {
        label: 'Heat Rate (kCal/kWh)',
        color: 'hsl(var(--chart-2))',
    },
};

const efficiencyData = [
    { day: 'Mon', efficiency: 88 },
    { day: 'Tue', efficiency: 89.5 },
    { day: 'Wed', efficiency: 89.2 },
    { day: 'Thu', efficiency: 90.1 },
    { day: 'Fri', efficiency: 89.8 },
    { day: 'Sat', efficiency: 89.5 },
    { day: 'Sun', efficiency: 89.9 },
];

const efficiencyChartConfig = {
    efficiency: {
        label: 'Efficiency (%)',
        color: 'hsl(var(--chart-3))',
    },
};

export default function Dashboard() {
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
                    {/* STEP 3: Update the JSX to use the new components */}
                    <ChartCard title="Anomaly Trend" description="Number of anomalies detected over time" icon={LineChartIcon} className="md:col-span-2">
                        <ChartContainer config={anomalyChartConfig} className="h-[300px] w-full">
                            <LineChart accessibilityLayer data={anomalyTrendData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line dataKey="anomalies" type="monotone" stroke="var(--color-anomalies)" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ChartContainer>
                    </ChartCard>

                    <ChartCard title="Heat Rate Distribution" description="Distribution of heat rates across units">
                        <ChartContainer config={heatRateChartConfig} className="h-[300px] w-full">
                            <BarChart accessibilityLayer data={heatRateData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="unit" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="heatRate" fill="var(--color-heatRate)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </ChartCard>

                    <ChartCard title="Efficiency Analysis" description="System efficiency breakdown">
                        <ChartContainer config={efficiencyChartConfig} className="h-[300px] w-full">
                            <LineChart accessibilityLayer data={efficiencyData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line dataKey="efficiency" type="monotone" stroke="var(--color-efficiency)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                    </ChartCard>
                </div>
            </div>
        </AppLayout>
    );
}