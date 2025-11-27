import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import type { TooltipProps } from 'recharts';

interface Reference {
    reff_id: number;
    description: string;
    is_default: 1 | 0;
}

interface ComparisonChartDataPoint {
    description: string;
    output: number;
    reference: number;
}

interface ParetoChartProps {
    data: ComparisonChartDataPoint[];
    loading: boolean;
    references: Reference[];
    selectedReferenceId: number | null;
    onReferenceChange: (refId: string) => void;
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 border rounded-lg shadow-md bg-background border-border">
                <p className="mb-2 font-medium text-foreground">{payload[0].payload.description}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name === 'Output' ? 'Output' : 'Reference'}:</span>
                        <span className="font-semibold text-foreground">
                            {entry.name === 'Output'
                                ? entry.payload.output.toLocaleString(undefined, { maximumFractionDigits: 2 })
                                : entry.payload.reference.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            }
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

// Custom tick component for XAxis to wrap long labels
interface WrappedXAxisTickProps {
    x: number;
    y: number;
    payload: {
        value: string;
    };
}

const WrappedXAxisTick = ({ x, y, payload }: WrappedXAxisTickProps) => {
    const label = payload.value as string;
    const maxCharsPerLine = 10; // Adjust this value as needed
    const words = label.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
        if ((currentLine + word).length > maxCharsPerLine && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });
    lines.push(currentLine.trim());

    return (
        <text x={x} y={y} dy={16} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={12}>
            {lines.map((line, index) => (<tspan key={index} x={x} dy={index > 0 ? "1.2em" : 0}>{line}</tspan>))}
        </text>
    );
};

export function ParetoChartTab2({ data, loading, references, selectedReferenceId, onReferenceChange }: ParetoChartProps) {
    const chartConfig = useMemo((): ChartConfig => {
        return {
            output: {
                label: "Output",
                color: "var(--chart-1)",
            },
            reference: {
                label: "Reference",
                color: "var(--chart-2)",
            },
        };
    }, []);

    // Prepare data for log scale: map 0 to a small number to make it visible
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(item => ({
            ...item,
            displayOutput: item.output === 0 ? 0.1 : item.output,
            displayReference: item.reference === 0 ? 0.1 : item.reference,
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
            <h3 className="mb-6 text-lg font-semibold text-blue-700 dark:text-blue-300">Output vs. Baseline Comparison</h3>
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
            <div className="w-full h-[400px] overflow-x-auto overflow-y-hidden">
                <div style={{ minWidth: `${data.length * 80}px`, height: '100%' }}>
                    <ChartContainer config={chartConfig} className="w-full h-full"> 
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                <CartesianGrid vertical={false} />
                                <YAxis 
                                    scale="log"
                                    type="number"
                                    domain={[0.1, 'auto']}
                                    allowDecimals={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                />
                                <XAxis
                                    dataKey="description"
                                    type="category"
                                    tickMargin={10}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={0}
                                    tick={WrappedXAxisTick}
                                    height={50}
                                />
                                <ChartTooltip cursor={false} content={<CustomTooltip />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="displayOutput" name="Output" fill="var(--chart-1)" radius={4} />
                                <Bar dataKey="displayReference" name="Reference" fill="var(--chart-2)" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
}