import { useTheme } from '@/contexts/ThemeContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartData,
    type ChartOptions,
} from 'chart.js';
import { useEffect, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface ChartProps {
    type: 'line' | 'bar';
    data: ChartData<'line' | 'bar'>;
    options?: ChartOptions<'line' | 'bar'>;
    className?: string;
}

export function Chart({ type, data, options, className = '' }: ChartProps) {
    const { theme } = useTheme();
    const chartRef = useRef<ChartJS>(null);

    // Update chart colors when theme changes
    useEffect(() => {
        if (chartRef.current) {
            const isDark = theme === 'dark';
            const textColor = isDark ? '#94a3b8' : '#64748b'; // muted-foreground
            const gridColor = isDark ? '#1e293b20' : '#f1f5f920'; // muted with opacity

            chartRef.current.options.scales = {
                ...chartRef.current.options.scales,
                x: {
                    ...chartRef.current.options.scales?.x,
                    grid: {
                        ...chartRef.current.options.scales?.x?.grid,
                        color: gridColor,
                    },
                    ticks: {
                        ...chartRef.current.options.scales?.x?.ticks,
                        color: textColor,
                    },
                },
                y: {
                    ...chartRef.current.options.scales?.y,
                    grid: {
                        ...chartRef.current.options.scales?.y?.grid,
                        color: gridColor,
                    },
                    ticks: {
                        ...chartRef.current.options.scales?.y?.ticks,
                        color: textColor,
                    },
                },
            };

            chartRef.current.options.plugins = {
                ...chartRef.current.options.plugins,
                legend: {
                    ...chartRef.current.options.plugins?.legend,
                    labels: {
                        ...chartRef.current.options.plugins?.legend?.labels,
                        color: textColor,
                    },
                },
            };

            chartRef.current.update();
        }
    }, [theme]);

    const defaultOptions: ChartOptions<'line' | 'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    const ChartComponent = type === 'line' ? Line : Bar;

    return (
        <div className={className}>
            <ChartComponent ref={chartRef} data={data} options={{ ...defaultOptions, ...options }} />
        </div>
    );
} 