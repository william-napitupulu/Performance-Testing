import { Performance } from '@/data/mockPerformanceData';
import { getCurrentDateString } from '@/utils';
import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
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
    const [performances, setPerformances] = useState<Performance[]>(initialPerformances);
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

    const handleDelete = useCallback(async (id: number) => {
        const performance = performances.find((p) => p.id === id);
        
        // Check if performance exists and is editable
        if (!performance || performance.status !== 'Editable') {
            showError('This performance record cannot be deleted');
            return;
        }

        // Prevent multiple rapid deletions of the same item
        if (deletingIds.has(id)) {
            return;
        }

        // Confirm deletion
        if (!window.confirm('Are you sure you want to delete this performance record?')) {
            return;
        }

        // Mark as being deleted
        setDeletingIds(prev => new Set(prev).add(id));

        // Store the item for potential rollback
        const originalPerformances = [...performances];
        const originalFilteredData = [...filteredData];

        // Optimistically remove from UI immediately
        setPerformances(prev => prev.filter(p => p.id !== id));
        setFilteredData(prev => prev.filter(p => p.id !== id));

        try {
            // Attempt server deletion
            await router.delete(`/performance/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success - show success message
                    success('Performance record deleted successfully');
                },
                onError: (errors) => {
                    // Server error - rollback optimistic update
                    setPerformances(originalPerformances);
                    setFilteredData(originalFilteredData);
                    
                    const errorMessage = typeof errors === 'string' 
                        ? errors 
                        : 'Failed to delete performance record';
                    showError(errorMessage);
                },
                onFinish: () => {
                    // Always remove from deleting set when done
                    setDeletingIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(id);
                        return newSet;
                    });
                }
            });
        } catch (error) {
            // Network/client error - rollback optimistic update
            console.error('Error deleting performance:', error);
            
            setPerformances(originalPerformances);
            setFilteredData(originalFilteredData);
            
            showError('Failed to delete performance record. Please try again.');
            
            // Remove from deleting set
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    }, [performances, filteredData, deletingIds, success, showError]);

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
        <div className="bg-background p-6">
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-800/50 dark:bg-red-900/10">
                    <div className="text-red-700 dark:text-red-300">{error}</div>
                </div>
            )}

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800/50 dark:bg-blue-900/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Performance List</h2>
                        {selectedUnitName && <p className="text-sm text-blue-600 dark:text-blue-400">Unit: {selectedUnitName}</p>}
                    </div>
                </div>
            </div>

            <PerformanceListTable
                data={filteredData}
                allData={performances}
                editingId={editingId}
                editForm={editForm}
                showEditTooltip={showEditTooltip}
                editTooltipMessage={editTooltipMessage}
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
