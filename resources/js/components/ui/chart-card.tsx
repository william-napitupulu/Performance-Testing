import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    children: ReactNode;
    className?: string;
}

export function ChartCard({ title, description, icon: Icon, children, className = '' }: ChartCardProps) {
    return (
        <div className={`rounded-xl border border-border bg-card p-6 dark:bg-muted/10 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                </div>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="mt-4">{children}</div>
        </div>
    );
} 