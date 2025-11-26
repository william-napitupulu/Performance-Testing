import { Performance } from '@/data/mockPerformanceData';
import { getCurrentDateString } from '@/utils';
import { router } from '@inertiajs/react';
import { useState, useCallback, useEffect } from 'react';
import { PerformanceListActions } from './PerformanceListActions';
import { PerformanceListTable } from './PerformanceListTable';
import { useToast, ToastContainer } from '@/components/ui/toast';

interface PerformanceListContainerProps {
    initialPerformances: Performance[];
    selectedUnit: number;
    selectedUnitName?: string;
    error?: string;
}

export function PerformanceListContainer({ initialPerformances, selectedUnit, selectedUnitName, error }: PerformanceListContainerProps) {
    const [filteredData, setFilteredData] = useState<Performance[]>(initialPerformances);
    const [sortField, setSortField] = useState<keyof Performance | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Performance>>({});
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newForm, setNewForm] = useState<Partial<Performance>>({
        description: '',
        status: 'Editable' as const,
        date_perfomance: getCurrentDateString(),
        unit_id: selectedUnit || 1,
    });

    useEffect(() => {
        setFilteredData(initialPerformances);
    }, [initialPerformances]);

    // Toast notifications
    const { toasts, removeToast, success, error: showError } = useToast();

    // Track items being deleted to prevent multiple rapid deletions
    const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

    // Tooltip state
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipMessage, setTooltipMessage] = useState('');
    const [showEditTooltip, setShowEditTooltip] = useState(false);
    const [editTooltipMessage, setEditTooltipMessage] = useState('');

    // Sorting handler
    const handleSort = (field: keyof Performance) => {
        const isAsc = sortField === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(field);

        const sorted = [...filteredData].sort((a, b) => {
            const aValue = a[field] ?? '';
            const bValue = b[field] ?? '';

            if (aValue === null) return 1;
            if (bValue === null) return -1;

            const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            return isAsc ? -comparison : comparison;
        });

        setFilteredData(sorted);
    };

    const handleDetail = (performance: Performance) => {
        // Navigate to output/details with perf_id query param
        router.visit(`/output?perf_id=${performance.id}`);
    };

    // CRUD Operations
    const handleEdit = (performance: Performance) => {
        // Navigate to data-analysis with perf_id query param
        router.visit(`/data-analysis?perf_id=${performance.id}`);
    };

    const handleSaveEdit = async () => {
        if (!editForm.description?.trim()) {
            setEditTooltipMessage('Please fill in the description before saving!');
            setShowEditTooltip(true);
            setTimeout(() => setShowEditTooltip(false), 3000);
            return;
        }

        if (editingId && editForm.description && editForm.status && editForm.date_perfomance) {
            try {
                await router.put(`/performance/${editingId}`, {
                    description: editForm.description,
                    status: editForm.status,
                    date_perfomance: editForm.date_perfomance,
                });
                router.reload();
            } catch (error) {
                console.error('Error updating performance:', error);
                setEditTooltipMessage('Failed to update performance record');
                setShowEditTooltip(true);
                setTimeout(() => setShowEditTooltip(false), 3000);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleDelete = useCallback((id: number) => {
        // Check if performance is deletable based on frontend data (good for UX)
        const performance = initialPerformances.find((p) => p.id === id);
        if (performance?.status !== 'Editable') {
            showError('Locked records cannot be deleted.');
            return;
        }
        // Proactive check based on the new 'reference_exists' flag from the backend
        if (performance?.reference_exists) {
            showError('Cannot delete: This performance is used as a baseline.');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this performance record?')) {
            return;
        }

        // Use Inertia's router with its built-in callbacks
        router.delete(route('performance.destroy', id), {
            preserveScroll: true,
            // onStart is called when the request begins
            onStart: () => {
                setDeletingIds(prev => new Set(prev).add(id));
            },
            // onSuccess is ONLY called if the server responds with success
            onSuccess: (page) => {
                if (page.props.flash?.error) {
                    showError(page.props.flash.error as string);
                } else {
                    success('Performance record is deleted successfully.');
                }
                // Inertia will automatically reload the 'performances' prop with the updated list
            },
            // onError is ONLY called if the server responds with an error
            onError: () => {
                showError('An unexpected error occurred while deleting the record.');
            },
            // onFinish is ALWAYS called after the request completes (success or error)
            onFinish: () => {
                setDeletingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            }
        });
    }, [initialPerformances, success, showError]); // Dependencies for the useCallback hook

    const handleAddNew = async () => {
        if (!newForm.description?.trim()) {
            setTooltipMessage('Please fill in the description before saving!');
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
            return;
        }

        if (newForm.description && newForm.status && newForm.date_perfomance) {
            try {
                await router.post('/performance', {
                    description: newForm.description,
                    status: newForm.status,
                    date_perfomance: newForm.date_perfomance,
                });
                router.reload();
            } catch (error) {
                console.error('Error adding performance:', error);
                setTooltipMessage('Failed to add performance record');
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 3000);
            }
        }
    };

    const handleCancelAdd = () => {
        setNewForm({
            description: '',
            status: 'Editable' as const,
            date_perfomance: getCurrentDateString(),
            unit_id: selectedUnit || 1,
        });
        setIsAddingNew(false);
    };

    const handleEditFormChange = (field: keyof Performance, value: string | number) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleNewFormChange = (field: keyof Performance, value: string | number) => {
        setNewForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddFromServer = () => {
        router.visit('/data-analysis');
    };

    return (
        <div className="p-6 bg-background">
            {error && (
                <div className="p-4 mb-4 border border-red-200 rounded-lg shadow-sm bg-red-50 dark:border-red-800/50 dark:bg-red-900/10">
                    <div className="text-red-700 dark:text-red-300">{error}</div>
                </div>
            )}

            <div className="p-4 mb-4 border border-blue-200 rounded-lg shadow-sm bg-blue-50 dark:border-blue-800/50 dark:bg-blue-900/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Performance Test List</h2>
                        {selectedUnitName && <p className="text-sm text-blue-600 dark:text-blue-400">Unit: {selectedUnitName}</p>}
                    </div>
                </div>
            </div>

            <PerformanceListTable
                data={filteredData}
                allData={initialPerformances}
                editingId={editingId}
                editForm={editForm}
                showEditTooltip={showEditTooltip}
                editTooltipMessage={editTooltipMessage}
                onDetail={handleDetail}
                onEdit={handleEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDelete}
                onEditFormChange={handleEditFormChange}
                onSort={handleSort}
                onFilteredDataChange={setFilteredData}
                sortField={sortField}
                sortDirection={sortDirection}
                deletingIds={deletingIds}
            />

            <PerformanceListActions
                isAddingNew={isAddingNew}
                newForm={newForm}
                showTooltip={showTooltip}
                tooltipMessage={tooltipMessage}
                selectedUnitName={selectedUnitName}
                onAddNew={handleAddNew}
                onCancelAdd={handleCancelAdd}
                onNewFormChange={handleNewFormChange}
                onAddFromServer={handleAddFromServer}
                setIsAddingNew={setIsAddingNew}
            />

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
}
