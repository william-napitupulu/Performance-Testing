import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Reference {
    reff_id: number;
    description: string;
    is_default: number;
}

interface ChartData {
    description: string;
    value: number;
}

interface ParetoChartProps {
    data: ChartData[];
    loading: boolean;
    references: Reference[];
    selectedReferenceId: number | null;
    onReferenceChange: (refId: string) => void;
}

export function ParetoChartTab({ data, loading, references, selectedReferenceId, onReferenceChange }: ParetoChartProps) {
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
            <h3 className="mb-6 text-lg font-semibold text-blue-700 dark:text-blue-300">Top 7 Highest Output and Baseline Difference</h3>
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
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart
                        layout="vertical" // Use a horizontal layout for better label readability
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            strokeOpacity={0.2}
                            stroke="#f59e0b"
                        />
                        <XAxis 
                            type="number"
                            tick={{ fill: '#d97706' }}
                            axisLine={{ stroke: '#4f46e5' }} // Tailwind's amber-500
                            tickLine={{ stroke: '#4f46e5' }} // Tailwind's amber-500
                        />
                        <YAxis
                            dataKey="description"
                            type="category"
                            width={150} // Adjust width for labels
                            tick={{ fontSize: 12, fill: '#d97706' }}
                            axisLine={{ stroke: '#4f46e5' }} // Tailwind's amber-500
                            tickLine={{ stroke: '#4f46e5' }} // Tailwind's amber-500
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(238, 242, 255, 0.5)' }} // Tailwind's indigo-50
                            contentStyle={{
                                backgroundColor: '#020817',
                                border: '0.5px solid var(--color-border)',
                                borderRadius: '0.5rem',
                                fontFamily: 'var(--font-sans)',
                            }}
                        />
                        <Bar dataKey="value" fill="#4f46e5" /> {/* Tailwind's indigo-600 */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}