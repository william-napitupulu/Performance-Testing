import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import type { TooltipProps } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { scaleSymlog } from "d3-scale";

interface Reference {
    reff_id: number;
    description: string;
    is_default: 1 | 0;
}

interface ComparisonChartDataPoint {
    description: string;
    output: number;
    reference: number;
    status?: number | null;
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
                        <span className="text-muted-foreground">{entry.name === 'Output' ? 'Output' : 'Baseline'}:</span>
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
        return data
            .filter(item => item.status === 1)
            .map(item => ({
                ...item,
                displayOutput: item.output,
                displayReference: item.reference,
            }));
    }, [data]);

    const excludedData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => item.status !== 1);
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
                                    scale={scaleSymlog().constant(1)}
                                    type="number"
                                    domain={['auto', 'auto']}
                                    allowDecimals={true}
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
                                <Bar dataKey="displayOutput" name="Output" fill="var(--chart-1)" radius={4} />
                                <Bar dataKey="displayReference" name="Reference" fill="var(--chart-2)" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </div>
            {excludedData.length > 0 && (
                <Card className="mt-6 bg-gray-100 dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle>Other Tag</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table className="min-w-full text-sm divide-y divide-border">
                                <TableHeader className="bg-muted">
                                    <TableRow>
                                        <TableHead className="px-4 py-2 font-medium">Description</TableHead>
                                        <TableHead className="px-4 py-2 font-medium">Output</TableHead>
                                        <TableHead className="px-4 py-2 font-medium">Baseline</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-gray-100 divide-y divide-border dark:bg-gray-800">
                                    {excludedData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="px-4 py-2">{item.description}</TableCell>
                                            <TableCell className="px-4 py-2">{item.output.toLocaleString()}</TableCell>
                                            <TableCell className="px-4 py-2">{item.reference.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}