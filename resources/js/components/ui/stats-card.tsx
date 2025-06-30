import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 dark:bg-muted/10">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">{value}</h3>
                {trend && (
                    <span
                        className={`inline-flex items-center gap-0.5 text-sm ${
                            trend.isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                        }`}
                    >
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                        <span className="text-muted-foreground">{trend.label}</span>
                    </span>
                )}
            </div>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
    );
} 