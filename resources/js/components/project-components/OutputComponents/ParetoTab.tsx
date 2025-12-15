import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { TooltipProps } from 'recharts';

interface Reference {
    reff_id: number;
    description: string;
    is_default: number;
}

interface ChartData {
    description: string;
    value: number;
    real_difference: number;
    output_val: number;
    baseline_val: number;
}

interface ParetoChartProps {
    data: ChartData[];
    loading: boolean;
    references: Reference[];
    selectedReferenceId: number | null;
    onReferenceChange: (refId: string) => void;
}

// Custom Tooltip Component for ParetoTab
const CustomTooltipForParetoTab = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0].payload as ChartData; // Original data point { description, value, displayValue }
        return (
            <div className="p-3 border rounded-lg shadow-md bg-background border-border">
                <p className="mb-2 font-medium text-foreground">{dataPoint.description}</p>
                <div className="flex items-center gap-2 pt-1 mt-1 text-sm border-t">
                    <span className="text-muted-foreground">Difference:</span>
                    <span className="font-semibold text-foreground">
                        {dataPoint.real_difference > 0 ? '+' : ''}
                        {dataPoint.real_difference.toLocaleString()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

// Custom tick component for YAxis to wrap long labels
interface WrappedXAxisTickProps {
    x: number;
    y: number;
    payload: {
        value: string;
    };
    width: number;
}

const WrappedYAxisTick = ({ x, y, payload, width }: WrappedXAxisTickProps) => {
    const label = payload.value as string;
    const maxCharsPerLine = Math.floor(width / 8); // Estimate max characters based on width
    const words = label.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
        if (currentLine.length > 0 && (currentLine + ' ' + word).length > maxCharsPerLine) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
        }
    });
    lines.push(currentLine.trim());

    const yOffset = y - (lines.length -1)*6;

    return (
        <text x={x} y={yOffset} dy={16} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize={12}>
            {lines.map((line, index) => (<tspan key={index} x={x} dy={index > 0 ? "1.2em" : 0}>{line}</tspan>))}
        </text>
    );
};

export function ParetoChartTab({ data, loading, references, selectedReferenceId, onReferenceChange }: ParetoChartProps) {
    const chartConfig = useMemo((): ChartConfig => {
        return {
            value: {
                label: "Value",
                color: "var(--chart-1)",
            },
        };
    }, []);

    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(item => ({
            ...item,
            displayValue: item.value,
        }));
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-6 h-6 mr-2 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                <span className="text-blue-600 dark:text-blue-400">Loading Chart Data...</span>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500 dark:text-gray-400">No data available to display the chart.</p>
            </div>
        );
    }

    return (
        <div className="p-6 border rounded-lg shadow-lg border-border bg-card dark:border-gray-700 dark:bg-gray-800"> {/* Consistent styling */}
            <h3 className="mb-6 text-lg font-semibold text-blue-700 dark:text-blue-300">Top 7 Highest Output and Baseline Difference</h3>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Baseline Selection</label>
                <label className="text-sm font-medium">Baseline:</label>
                    <Select
                        value={selectedReferenceId?.toString()}
                        onValueChange={onReferenceChange}
                    >
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select a baseline..." />
                        </SelectTrigger>
                        <SelectContent>
                            {references.map((ref) => (
                                <SelectItem key={ref.reff_id} value={ref.reff_id.toString()}>
                                    {ref.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
            </div>
            <div className="w-full h-[500px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }} layout="vertical">
                            <CartesianGrid horizontal={false} />
                            <XAxis
                                type="number"
                                //domain={[0.1, 'auto']}
                                tickFormatter={(value) => `${value}%`}
                                allowDecimals={false}
                                tickMargin={10}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            />
                            <YAxis
                                dataKey="description"
                                type="category"
                                tickMargin={5}
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                width={150}
                                tick={<WrappedYAxisTick width={150} x={0} y={0} payload={{value: ''}} />}
                            />
                            <ChartTooltip cursor={false} content={<CustomTooltipForParetoTab />} />
                            <Bar dataKey="displayValue" name="Value" fill="var(--chart-1)" radius={4}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`} 
                                        // If value is negative, use Red (destructive), else Blue (chart-1)
                                        fill={entry.value < 0 ? "hsl(var(--destructive))" : "var(--chart-1)"} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
}