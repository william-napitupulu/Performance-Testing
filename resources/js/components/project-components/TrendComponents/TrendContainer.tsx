import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { format, isValid, parseISO, subDays } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface OutputTag {
    output_id: number;
    description: string;
    satuan: string;
}

interface Trending {
    id: number;
    name: string;
    description?: string;
    tags: OutputTag[];
}

interface ChartDataPoint {
    perf_id: number;
    date_perfomance: string;
    output_id: number | string;
    value: number;
}

interface ProcessedChartData {
    date: string;
    [key: string]: string | number;
}

const getChartColor = (index: number) => `var(--chart-${(index % 5) + 1})`;

export function TrendContainer() {
    const [templates, setTemplates] = useState<Trending[]>([]);
    const [rawChartData, setRawChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(false);

    const [fromDate, setFromDate] = useState<Date | undefined>(subDays(new Date(), 365));
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [fromOpen, setFromOpen] = useState(false);
    const [toOpen, setToOpen] = useState(false);

    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch('/trending/templates');
                const data: Trending[] = await response.json();
                setTemplates(data);
                
                // Select the first template by default if available
                if (data.length > 0) {
                    setSelectedTemplateId(data[0].id.toString());
                }
            } catch (error) {
                console.error("Failed to fetch templates:", error);
            }
        };
        
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (!selectedTemplateId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    template_id: selectedTemplateId,
                });

                if (fromDate) params.append('start_date', format(fromDate, 'yyyy-MM-dd'));
                if (toDate) params.append('end_date', format(toDate, 'yyyy-MM-dd'));

                const response = await fetch(`/trending/data?${params.toString()}`);
                const data: ChartDataPoint[] = await response.json();
                setRawChartData(data);
            } catch (error) {
                console.error("Failed to fetch chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedTemplateId, fromDate, toDate]);

    const activeTemplate = useMemo(() =>
        templates.find(t => t.id.toString() === selectedTemplateId),
        [templates, selectedTemplateId]
    );

    // const visibleTags = useMemo(() => 
    //     mockOutputTag.filter(tag => activeTemplate.output_ids.includes(tag.output_id)),
    // [activeTemplate]);

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        if (activeTemplate?.tags) {
            activeTemplate.tags.forEach((tag, index) => {
                config[`tag_${tag.output_id}`] = {
                label: `${tag.description} (${tag.satuan})`,
                color: getChartColor(index),
                };
            });
        }
        return config;
    }, [activeTemplate]);

    const processedData = useMemo(() => {
        if (!rawChartData.length) return [];
        const groupedByDate: Record<string, ProcessedChartData> = {};

        rawChartData.forEach((record) => {
            const dateKey = record.date_perfomance.split(" ")[0];
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date:dateKey};
            }
            groupedByDate[dateKey][`tag_${record.output_id}`] = record.value;
        });

        return Object.values(groupedByDate).sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [rawChartData]);

    const handleQuickRange = (val: string) => {
        const end = new Date();
        let start = new Date();
        if (val === "90d") start = subDays(end, 90);
        if (val === "180d") start = subDays(end, 180);
        if (val === "365d") start = subDays(end, 365);
        
        setFromDate(start);
        setToDate(end);
    };

    return (
        <div className="p-6 bg-background">
            <div className="p-4 mb-4 border border-blue-200 rounded-lg shadow-sm bg-blue-50 dark:border-blue-800/50 dark:bg-blue-900/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Trending Chart Output</h2>
                        <p className="text-sm text-blue-600/80">Select a Trending Template to analyze specific parameter relationship</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row">
                    <div className="flex-col w-full">
                        <CardTitle>{activeTemplate?.name}</CardTitle>
                        <CardDescription>
                            {activeTemplate
                                ? `Comparing: ${activeTemplate.tags.map(t => t.description).join(", ")}`
                                : "Select a template"
                            }
                        </CardDescription>
                    </div>         
                    <div className="flex justify-between w-full">
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="from-date" className="px-1">Time Range</Label>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Popover open={fromOpen} onOpenChange={setFromOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" id="from-date" className="justify-between w-40 font-normal">
                                                {fromDate ? fromDate.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon className="w-4 h-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 overflow-hidden" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={fromDate}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    setFromDate(date)
                                                    setFromOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <span className="text-muted-foreground">-</span>

                                    <Popover open={toOpen} onOpenChange={setToOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" id="to-date" className="justify-between w-40 font-normal">
                                                {toDate ? toDate.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon className="w-4 h-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 overflow-hidden" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={toDate}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    setToDate(date)
                                                    setToOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <Select onValueChange={handleQuickRange}>
                                        <SelectTrigger className="w-[110px]">
                                            <SelectValue placeholder="Presets" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="90d">Last 3 months</SelectItem>
                                            <SelectItem value="180d">Last 6 months</SelectItem>
                                            <SelectItem value="365d">Last 12 months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="trending-select" className="px-1">
                                Trending Setup
                            </Label>
                            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                                <SelectTrigger id="template-select" className="w-[160px] rounded-lg">
                                    <SelectValue placeholder="Select Trending..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {templates.map((t) => (
                                        <SelectItem key={t.id} value={t.id.toString()}>
                                            {t.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>                    
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        {loading ? (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                Loading data...
                            </div>
                        ) : processedData.length === 0 ? (
                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                No data found for this range.
                            </div>
                        ) : (
                            <LineChart
                                accessibilityLayer
                                data={processedData}
                                margin={{ left: 12, right: 30, top: 20, bottom: 20 }}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    tickFormatter={(value) => {if (!value) return ""; const date = parseISO(value); return isValid(date) ? format(date, "MMM d") : value}}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    width={40}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent/>}
                                />
                                <ChartLegend content={<ChartLegendContent/>} />
                                
                                {activeTemplate?.tags.map((tag, index) => (
                                    <Line
                                        key={tag.output_id}
                                        type="linear"
                                        dataKey={`tag_${tag.output_id}`}
                                        stroke={getChartColor(index)}
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: getChartColor(index) }}
                                        activeDot={{ r: 6 }}
                                        connectNulls
                                    />
                                ))}
                            </LineChart>
                        )}
                    
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}