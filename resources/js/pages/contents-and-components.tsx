import { BarChart, BarChartDataset } from '@/components/ui/bar-chart';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function ContentsAndComponents() {
    // Sample data for different chart examples
    const performanceData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Unit 1 Performance',
                data: [85, 92, 78, 96, 88, 94],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
            },
            {
                label: 'Unit 2 Performance',
                data: [78, 85, 82, 89, 91, 87],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
            },
        ] as BarChartDataset[],
    };

    const plantData = {
        labels: ['Suralaya', 'Paiton', 'Tanjung Jati', 'Cilacap', 'Pacitan'],
        datasets: [
            {
                label: 'Power Output (MW)',
                data: [2400, 2000, 1980, 1000, 315],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 101, 101, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                ],
            },
        ] as BarChartDataset[],
    };

    const temperatureData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'Boiler Temp (°C)',
                data: [580, 585, 592, 598, 595, 587],
            },
            {
                label: 'Steam Temp (°C)',
                data: [520, 525, 530, 535, 532, 528],
            },
            {
                label: 'Turbine Temp (°C)',
                data: [450, 455, 460, 465, 462, 458],
            },
        ] as BarChartDataset[],
    };

    const handleBarClick = (event: any, elements: any[], chart: any) => {
        if (elements.length > 0) {
            const element = elements[0];
            const datasetIndex = element.datasetIndex;
            const dataIndex = element.index;
            const dataset = chart.data.datasets[datasetIndex];
            const label = chart.data.labels[dataIndex];
            const value = dataset.data[dataIndex];

            alert(`Clicked on: ${dataset.label}\nLabel: ${label}\nValue: ${value}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Contents and Components - Bar Chart Examples" />

            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bar Chart Component Examples</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Reusable bar chart component with customizable options and themes</p>
                    </div>
                    {/* <Button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        variant="outline"
                        className="bg-white dark:bg-gray-800"
                    >
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </Button> */}
                </div>

                {/* Performance Chart */}
                <Card className="p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Plant Performance Comparison</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly performance metrics for different units</p>
                    </div>
                    <BarChart
                        {...performanceData}
                        title="Unit Performance Over Time"
                        xAxisLabel="Month"
                        yAxisLabel="Performance (%)"
                        height={400}
                        showLegend={true}
                        showGrid={true}
                        onBarClick={handleBarClick}
                        className="rounded-lg border"
                    />
                </Card>

                {/* Power Output Chart */}
                <Card className="p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Power Plant Capacity</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Maximum power output by plant location</p>
                    </div>
                    <BarChart
                        {...plantData}
                        title="Power Output by Plant"
                        xAxisLabel="Plant Location"
                        yAxisLabel="Power Output (MW)"
                        height={350}
                        showLegend={false}
                        onBarClick={handleBarClick}
                    />
                </Card>

                {/* Temperature Monitoring Chart */}
                <Card className="p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Temperature Monitoring</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">24-hour temperature readings from different components</p>
                    </div>
                    <BarChart
                        {...temperatureData}
                        title="System Temperature Overview"
                        xAxisLabel="Time"
                        yAxisLabel="Temperature (°C)"
                        height={400}
                        stacked={false}
                        onBarClick={handleBarClick}
                        customOptions={{
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return `${context.dataset.label}: ${context.parsed.y}°C`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </Card>

                {/* Horizontal Chart */}
                <Card className="p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Horizontal Bar Chart</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Equipment efficiency ratings displayed horizontally</p>
                    </div>
                    <BarChart
                        labels={['Boiler', 'Turbine', 'Generator', 'Condenser', 'Pump']}
                        datasets={[
                            {
                                label: 'Efficiency (%)',
                                data: [94, 88, 96, 85, 92],
                                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                            },
                        ]}
                        title="Equipment Efficiency Ratings"
                        xAxisLabel="Efficiency (%)"
                        yAxisLabel="Equipment"
                        height={350}
                        horizontal={true}
                        onBarClick={handleBarClick}
                    />
                </Card>

                {/*
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        How to Use the Bar Chart Component
                    </h2>
                    <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Basic Usage:</h3>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 overflow-x-auto">
{`import { BarChart } from '@/components/ui/bar-chart';

<BarChart
  labels={['Jan', 'Feb', 'Mar']}
  datasets={[{
    label: 'Sales',
    data: [100, 200, 150]
  }]}
  title="Monthly Sales"
  xAxisLabel="Month"
  yAxisLabel="Sales ($)"
/>`}
                            </pre>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Key Props:</h3>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><code>labels</code>: Array of x-axis labels</li>
                                <li><code>datasets</code>: Array of data series with styling options</li>
                                <li><code>title</code>, <code>xAxisLabel</code>, <code>yAxisLabel</code>: Chart labels</li>
                                <li><code>horizontal</code>: Creates horizontal bar chart</li>
                                <li><code>stacked</code>: Enables stacked bars</li>
                                <li><code>isDarkMode</code>: Automatically adapts colors for dark theme</li>
                                <li><code>onBarClick</code>: Handles click events on bars</li>
                                <li><code>customOptions</code>: Override any Chart.js options</li>
                            </ul>
                        </div>
                    </div>
                </Card>
                */}
            </div>
        </AppLayout>
    );
}
