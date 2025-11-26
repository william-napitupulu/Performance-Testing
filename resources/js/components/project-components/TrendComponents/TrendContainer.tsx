import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { format, isValid, parseISO, subDays } from "date-fns";
import { ChevronDownIcon, PlusCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface OutputTag {
    output_id: number;
    description: string;
    satuan: string;
    max_value?: number | null;
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

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        dataKey: string;
        name: string;
        color: string;
        payload: {
            [key: string]: string | number;
        };
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 border rounded-lg shadow-md bg-background border-border">
                <p className="mb-2 font-medium">{label ? format(parseISO(label), "MMM d, yyyy") : ''}</p>
                {payload.map((entry, index) => {
                    // We retrieve the original data key
                    const dataKey = entry.dataKey as string; // e.g., "tag_4_norm"
                    const originalKey = dataKey.replace("_norm", "_original");
                    const originalValue = entry.payload[originalKey];
                    
                    return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-semibold">
                                { originalValue !== undefined
                                    ? Number(originalValue).toLocaleString(undefined, { maximumFractionDigits: 2 })
                                    : "N/A"
                                } {/* Format number */}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

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

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [availableTags, setAvailableTags] = useState<OutputTag[]>([]);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [newTemplateTags, setNewTemplateTags] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

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

                const tagResponse = await fetch('/trending/tags');
                if(tagResponse.ok) {
                    const tagData = await tagResponse.json();
                    setAvailableTags(tagData);
                } else {
                    const uniqueTags = new Map();
                    data.forEach((t: Trending) => {
                        t.tags.forEach(tag => uniqueTags.set(tag.output_id, tag));
                    });
                    setAvailableTags(Array.from(uniqueTags.values()));
                }
            } catch (error) {
                console.error("Failed to fetch templates:", error);
            }
        };
        
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (!selectedTemplateId || selectedTemplateId === "NEW") return;

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

    const handleTemplateChange = (val: string) => {
        if (val === "NEW") {
            setNewTemplateName("");
            setNewTemplateTags([]);
            setIsCreateOpen(true);
        } else {
            setSelectedTemplateId(val);
        }
    };

    const toggleTagSelection = (tagId: number) => {
        setNewTemplateTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    }

    const handleSaveNewTemplate = async () => {
        if (!newTemplateName || newTemplateTags.length === 0) return;
        setIsSaving(true);

        try {
            // Sending data to backend
            const response = await fetch('/trending/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
                body: JSON.stringify({
                    name: newTemplateName,
                    output_ids: newTemplateTags
                })
            });

            if (response.ok) {
                const newTemplate = await response.json();
                setTemplates([...templates, newTemplate]);
                setSelectedTemplateId(newTemplate.id.toString());
                setIsCreateOpen(false);
            }
        } catch (error) {
            console.error("Failed to create template", error);
        } finally {
            setIsSaving(false);
        }
    };

    const activeTemplate = useMemo(() =>
        templates.find(t => t.id.toString() === selectedTemplateId),
        [templates, selectedTemplateId]
    );

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        if (activeTemplate?.tags) {
            activeTemplate.tags.forEach((tag, index) => {
                config[`tag_${tag.output_id}_norm`] = {
                label: `${tag.description} (${tag.satuan})`,
                color: getChartColor(index),
                };
            });
        }
        return config;
    }, [activeTemplate]);

    const processedData = useMemo(() => {
        if (!rawChartData.length || !activeTemplate) return [];
        const groupedByDate: Record<string, ProcessedChartData> = {};

        const tagMetaMap = new Map<number, OutputTag>();
        activeTemplate.tags.forEach(tag => tagMetaMap.set(tag.output_id, tag));

        const observedMeta: Record<string, { min: number; max: number }> = {};
        rawChartData.forEach((record) => {
            const tagKey = `tag_${record.output_id}`;
            if (!observedMeta[tagKey]) {
                observedMeta[tagKey] = { min: record.value, max: record.value };
            } else {
                if (record.value < observedMeta[tagKey].min) observedMeta[tagKey].min = record.value;
                if (record.value > observedMeta[tagKey].max) observedMeta[tagKey].max = record.value;
            }
        });

        rawChartData.forEach((record) => {
            const dateKey = record.date_perfomance.split(" ")[0];
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date:dateKey};
            }

            const tagId = Number(record.output_id);
            const tagInfo = tagMetaMap.get(tagId);
            const tagKey = `tag_${tagId}`;

            let normalizationMax: number;

            if (tagInfo?.max_value && tagInfo.max_value > 0) {
                normalizationMax = tagInfo.max_value === 0 ? 0 :50;
            } else if (tagInfo?.satuan === '%') {
                normalizationMax = 100;
            } else {
                normalizationMax = observedMeta[tagKey]?.max || 1;
            }

            let normalizedValue = 0;

            if (!tagInfo?.max_value && tagInfo?.satuan !== '%' && observedMeta[tagKey]?.max === observedMeta[tagKey]?.min && observedMeta[tagKey]?.max !== 0) {
                normalizedValue = 50;
            } else {
                // Standard Normalization: (Value / Max) * 100
                // Cap it at 100 (in case value > max_value due to bad data/config)
                const calculated = (record.value / normalizationMax) * 100;
                normalizedValue = calculated > 100 ? 100 : calculated;
            }
            
            groupedByDate[dateKey][`${tagKey}_norm`] = normalizedValue;
            groupedByDate[dateKey][`${tagKey}_original`] = record.value;
        });

        return Object.values(groupedByDate).sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [rawChartData, activeTemplate]);

    

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
                            <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                                <SelectTrigger id="template-select" className="w-[160px] rounded-lg">
                                    <SelectValue placeholder="Select Trending..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="NEW" className="font-semibold text-blue-600 cursor-pointer focus:text-blue-700 focus:bg-blue-50">
                                        <div className="flex items-center gap-2">
                                            <PlusCircle className="w-4 h-4" />
                                            Create New Setup
                                        </div>
                                    </SelectItem>
                                    <div className="h-px my-1 bg-muted"/>
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
                                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                                    domain={[0, 100]}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<CustomTooltip/>}
                                />
                                <ChartLegend content={<ChartLegendContent/>} />
                                
                                {activeTemplate?.tags.map((tag, index) => (
                                    <Line
                                        key={tag.output_id}
                                        type="linear"
                                        dataKey={`tag_${tag.output_id}_norm`}
                                        name={tag.description}
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
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Trending Setup</DialogTitle>
                        <DialogDescription>
                            Give your setup a name and select the parameters you want to compare on the chart.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        {/* Name Input */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name" className="text-right">Setup Name</Label>
                            <Input 
                                id="name" 
                                placeholder="e.g., Boiler Efficiency vs Load" 
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                            />
                        </div>

                        {/* Tag Selection List */}
                        <div className="flex flex-col gap-2">
                            <Label>Select Parameters to Compare</Label>
                            <div className="h-[250px] w-full rounded-md border p-4 overflow-y-auto">
                                {availableTags.length === 0 ? (
                                    <div className="py-8 text-sm text-center text-muted-foreground">
                                        Loading tags...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {availableTags.map((tag) => (
                                            <div key={tag.output_id} className="flex items-center space-x-2">
                                                <input 
                                                    type="checkbox" 
                                                    id={`tag-${tag.output_id}`}
                                                    className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                                                    checked={newTemplateTags.includes(tag.output_id)}
                                                    onChange={() => toggleTagSelection(tag.output_id)}
                                                />
                                                <label 
                                                    htmlFor={`tag-${tag.output_id}`} 
                                                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {tag.description} <span className="text-xs text-muted-foreground">({tag.satuan})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-right text-muted-foreground">
                                {newTemplateTags.length} tags selected
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={handleSaveNewTemplate} 
                            disabled={!newTemplateName || newTemplateTags.length < 1 || isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Setup"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}