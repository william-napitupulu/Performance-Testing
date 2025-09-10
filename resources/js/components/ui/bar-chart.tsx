import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ChartEvent,
  ActiveElement,
  TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface BarChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number;
}

export interface BarChartProps {
  // Data props
  labels: string[];
  datasets: BarChartDataset[];
  
  // Chart configuration
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  
  // Styling props
  width?: number;
  height?: number;
  className?: string;
  
  // Chart behavior
  showLegend?: boolean;
  showTooltips?: boolean;
  showGrid?: boolean;
  horizontal?: boolean;
  stacked?: boolean;
  
  // Animation
  animated?: boolean;
  animationDuration?: number;
  
  // Color theme
  isDarkMode?: boolean;
  
  // Custom options
  customOptions?: Partial<ChartOptions<'bar'>>;
  
  // Event handlers
  onBarClick?: (event: ChartEvent, elements: ActiveElement[], chart: ChartJS) => void;
}

export function BarChart({
  labels,
  datasets,
  title,
  xAxisLabel,
  yAxisLabel,
  width,
  height = 400,
  className = '',
  showLegend = true,
  showTooltips = true,
  showGrid = true,
  horizontal = false,
  stacked = false,
  animated = true,
  animationDuration = 750,
  isDarkMode = false,
  customOptions,
  onBarClick,
}: BarChartProps) {
  const chartRef = useRef<ChartJS<'bar'>>(null);

  // Default color palettes
  const lightColors = [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(16, 185, 129, 0.8)',   // green
    'rgba(245, 101, 101, 0.8)',  // red
    'rgba(251, 191, 36, 0.8)',   // yellow
    'rgba(139, 92, 246, 0.8)',   // purple
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(14, 165, 233, 0.8)',   // sky
    'rgba(34, 197, 94, 0.8)',    // emerald
  ];

  const darkColors = [
    'rgba(96, 165, 250, 0.8)',   // blue
    'rgba(52, 211, 153, 0.8)',   // green
    'rgba(248, 113, 113, 0.8)',  // red
    'rgba(252, 211, 77, 0.8)',   // yellow
    'rgba(167, 139, 250, 0.8)',  // purple
    'rgba(244, 114, 182, 0.8)',  // pink
    'rgba(56, 189, 248, 0.8)',   // sky
    'rgba(74, 222, 128, 0.8)',   // emerald
  ];

  const borderColors = isDarkMode 
    ? darkColors.map(color => color.replace('0.8', '1'))
    : lightColors.map(color => color.replace('0.8', '1'));

  const colors = isDarkMode ? darkColors : lightColors;

  // Process datasets with default colors
  const processedDatasets = datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor || colors[index % colors.length],
    borderColor: dataset.borderColor || borderColors[index % borderColors.length],
    borderWidth: dataset.borderWidth || 1,
    borderRadius: dataset.borderRadius || 4,
  }));

  const data: ChartData<'bar'> = {
    labels,
    datasets: processedDatasets,
  };

  // Chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    animation: animated ? {
      duration: animationDuration,
      easing: 'easeInOutQuart',
    } : false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 12,
            weight: 500,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'rect',
        },
      },
      title: {
        display: !!title,
        text: title,
        color: isDarkMode ? '#f9fafb' : '#111827',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        enabled: showTooltips,
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#f9fafb' : '#111827',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        displayColors: true,
        callbacks: {
          label: function (context: TooltipItem<'bar'>) {
              const label = context.dataset.label || '';
              const value = context.parsed.y ?? context.parsed.x;
              return `${label}: ${typeof value === 'number' ? value.toLocaleString() : value}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        stacked,
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          color: isDarkMode ? '#d1d5db' : '#6b7280',
          font: {
            size: 12,
            weight: 600,
          },
          padding: {
            top: 10,
          },
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
        grid: {
          display: showGrid,
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
          lineWidth: 1,
        },
        border: {
          color: isDarkMode ? '#4b5563' : '#d1d5db',
        },
      },
      y: {
        display: true,
        stacked,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: isDarkMode ? '#d1d5db' : '#6b7280',
          font: {
            size: 12,
            weight: 600,
          },
          padding: {
            bottom: 10,
          },
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
          },
          callback: function (tickValue: string | number) {
              const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
              if (isNaN(value)) return tickValue;
              
              if (Math.abs(value) >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
              } else if (Math.abs(value) >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
              }
              return value.toLocaleString();
          },
        },
        grid: {
          display: showGrid,
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.5)',
          lineWidth: 1,
        },
        border: {
          color: isDarkMode ? '#4b5563' : '#d1d5db',
        },
      },
    },
    onClick: onBarClick,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    ...customOptions,
  };

  // Update chart theme when dark mode changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [isDarkMode]);

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: width || '100%', height }}
    >
      <Bar
        ref={chartRef}
        data={data}
        options={options}
        width={width}
        height={height}
      />
    </div>
  );
}

// Helper function to generate sample data
export const generateSampleBarData = (labels: string[], datasets: number = 1): BarChartProps => {
  const sampleDatasets: BarChartDataset[] = [];
  
  for (let i = 0; i < datasets; i++) {
    sampleDatasets.push({
      label: `Dataset ${i + 1}`,
      data: labels.map(() => Math.floor(Math.random() * 1000) + 100),
    });
  }
  
  return {
    labels,
    datasets: sampleDatasets,
  };
};

export default BarChart;