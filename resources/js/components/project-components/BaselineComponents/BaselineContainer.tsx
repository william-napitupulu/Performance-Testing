import { Baseline } from '@/data/baselineData';
import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { BaselineTable } from './BaselineTable';
import { useToast, ToastContainer } from '@/components/ui/toast';

interface BaselineContainerProps {
    initialBaselines: Baseline[];
    selectedUnit: number;
    selectedUnitName?: string;
    error?: string;
}

export function BaselineContainer({ initialBaselines, error }: BaselineContainerProps) {
    const [filteredData, setFilteredData] = useState<Baseline[]>(initialBaselines);
    const [sortField, setSortField] = useState<keyof Baseline | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    // Toast notifications
    const { toasts, removeToast, success, error: showError } = useToast();

    // Track items being deleted to prevent multiple rapid deletions
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

    // Sorting handler
    const handleSort = (field: keyof Baseline) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        const newDirection = isAsc ? 'desc' : 'asc';
        setSortDirection(newDirection);
        setSortField(field);

        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[field] ?? '';
            const bValue = b[field] ?? '';
            const comparison = String(aValue).localeCompare(String(bValue));
            return newDirection === 'asc' ? comparison : -comparison;
        });

        setFilteredData(sorted);
    };

    const handleViewDetails = (baseline: Baseline) => {
        // You might want a dedicated detail page later. For now, we can just log it.
        console.log("Viewing details for baseline:", baseline);
        router.visit(route('api.baseline.show', baseline.reff_id));
    };

    const handleDelete = useCallback((id: number) => {
        if (!window.confirm('Are you sure you want to delete this baseline? This action cannot be undone.')) {
            return;
        }
        
        // Example route, you will need to create this in web.php
        router.delete(route('api.baseline.destroy', id), {
            preserveScroll: true,
            onStart: () => setDeletingIds(prev => new Set(prev).add(id)),
            onSuccess: (page) => {
                if (page.props.flash?.error) {
                    showError(page.props.flash.error as string);
                } else {
                    success('Baseline deleted successfully.');
                }
            },
            onError: (errors) => showError(errors.error || 'Failed to delete baseline.'),
            onFinish: () => setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            }),
        });
    }, [success, showError]);

    // Placeholder for editing, as it's more complex
    //const handleSaveEdit = () => { /* Logic to be added later */ };
    //const handleCancelEdit = () => { /* Logic to be added later */ };
    //const handleEditFormChange = () => { /* Logic to be added later */ };

    return (
        <div className="bg-background p-6">
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-800/50 dark:bg-red-900/10">
                    <div className="text-red-700 dark:text-red-300">{error}</div>
                </div>
            )}

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800/50 dark:bg-blue-900/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Baseline List</h2>
                    </div>
                </div>
            </div>

            <BaselineTable
                data={filteredData}
                allData={initialBaselines}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                deletingIds={deletingIds}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onFilteredDataChange={setFilteredData}
                // Pass down other handlers as you build out edit/filter features
            />

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}
