import { Baseline } from '@/data/baselineData';
import { Eye, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from "@/components/ui/button";

interface BaselineTableRowProps {
    baseline: Baseline;
    onDelete: (id: number) => void;
    onViewDetails: (baseline: Baseline) => void;
    isDeleting?: boolean;
}

export function BaselineTableRow({
    baseline,
    onDelete,
    onViewDetails,
    isDeleting = false,
}: BaselineTableRowProps) {
    const cellClasses = 'px-6 py-4 text-sm';

    return (
        <tr className={`transition-all duration-300 ${
            isDeleting 
            ? 'opacity-50 bg-red-50 dark:bg-red-900/10 animate-pulse' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}>
            <td className={`${cellClasses} w-20 text-center`}>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">{baseline.reff_id}</span>
            </td>
            <td className={`${cellClasses} font-medium text-blue-700 dark:text-blue-300`}>{baseline.description}</td>
            <td className={`${cellClasses} font-medium text-violet-700 dark:text-violet-300`}>{baseline.keterangan || 'N/A'}</td>
            <td className={`${cellClasses} text-center`}>
                {baseline.is_default === 1 ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Default
                    </span>
                ) : (
                    <span className="text-gray-400">-</span>
                )}
            </td>
            <td className={`${cellClasses} text-center font-medium text-orange-700 dark:text-orange-300`}>{baseline.date_created}</td>
            <td className={`${cellClasses} space-x-2 text-center`}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onViewDetails(baseline)}
                                className="h-8 w-8 text-blue-600 disabled:text-gray-400"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            View Baseline Detail
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(baseline.reff_id)}
                                disabled={isDeleting}
                                className="h-8 w-8 text-red-600 disabled:text-gray-400"
                            >
                                <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-spin' : ''}`} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Baseline</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </td>
        </tr>
    );
}
