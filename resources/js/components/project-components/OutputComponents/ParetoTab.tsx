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
        const dataPoint = payload[0].payload as ChartData;
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

// Adjusted Tick Component for X-Axis (Bottom)
interface WrappedTickProps {
    x: number;
    y: number;
    payload: {
        value: string;
    };
    width: number;
}

const WrappedXAxisTick = ({ x, y, payload, width }: WrappedTickProps) => {
    if (!payload || !payload.value) return null;
    const label = String(payload.value);
    // Estimate chars based on band width (roughly width of the column space)
    const maxCharsPerLine = Math.max(10, Math.floor(width / 7)); 
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

    return (
        <text x={x} y={y} dy={16} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={12}>
            {lines.map((line, index) => (
                <tspan key={index} x={x} dy={index > 0 ? "1.1em" : 0}>
                    {line}
                </tspan>
            ))}
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
        <div className="p-6 border rounded-lg shadow-lg border-border bg-card dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-6 text-lg font-semibold text-blue-700 dark:text-blue-300">Top 10 Highest Output and Baseline Difference</h3>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Baseline Selection</label>
                <div className="flex items-center gap-2">
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
            </div>
            <div className="w-full h-[700px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer>
                        {/* CHANGE 1: Removed layout="vertical" (defaults to horizontal layout = vertical bars) */}
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            {/* CHANGE 2: Changed to vertical={false} so grid lines are horizontal */}
                            <CartesianGrid vertical={false} />
                            
                            {/* CHANGE 3: XAxis now handles Categories (Description) */}
                            <XAxis
                                dataKey="description"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                height={120} // Added height to accommodate wrapped text
                                tick={<WrappedXAxisTick width={100} x={0} y={0} payload={{value: ''}} />}
                                tickMargin={30}
                            />

                            {/* CHANGE 4: YAxis now handles Numbers (Percentage) */}
                            <YAxis
                                type="number"
                                tickFormatter={(value) => `${value}%`}
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            />
                            
                            <ChartTooltip cursor={false} content={<CustomTooltipForParetoTab />} />
                            
                            <Bar dataKey="displayValue" name="Value" fill="var(--chart-1)" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
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