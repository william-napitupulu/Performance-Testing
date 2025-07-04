import { useState, useEffect } from 'react';
import { Performance } from '@/data/mockPerformanceData';
import { router } from '@inertiajs/react';
import { getCurrentDateString } from '@/utils';
import { PerformanceListTable } from './PerformanceListTable';
import { PerformanceListActions } from './PerformanceListActions';

interface PerformanceListContainerProps {
  initialPerformances: Performance[];
  selectedUnit: number;
  selectedUnitName?: string;
  error?: string;
}

export function PerformanceListContainer({
  initialPerformances,
  selectedUnit,
  selectedUnitName,
  error
}: PerformanceListContainerProps) {
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
    unit_id: selectedUnit || 1
  });

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

  const handleDelete = async (id: number) => {
    const performance = performances.find(p => p.id === id);
    if (performance && performance.status === 'Editable') {
      if (window.confirm('Are you sure you want to delete this performance record?')) {
        try {
          await router.delete(`/performance/${id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
              // Remove locally without full reload
              setPerformances(prev => prev.filter(p => p.id !== id));
              setFilteredData(prev => prev.filter(p => p.id !== id));
              
              // Show success message
              if (page.props.success) {
                // Create a temporary toast notification
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300';
                toast.textContent = page.props.success as string;
                document.body.appendChild(toast);
                
                // Auto-remove after 3 seconds
                setTimeout(() => {
                  toast.style.opacity = '0';
                  setTimeout(() => document.body.removeChild(toast), 300);
                }, 3000);
              }
            },
          });
        } catch (error) {
          console.error('Error deleting performance:', error);
          alert('Failed to delete performance record');
        }
      }
    }
  };

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
      unit_id: selectedUnit || 1
    });
    setIsAddingNew(false);
  };

  const handleEditFormChange = (field: keyof Performance, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNewFormChange = (field: keyof Performance, value: string | number) => {
    setNewForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFromServer = () => {
    router.visit('/data-analysis');
  };

  return (
    <div className="p-6 bg-background">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/50 shadow-sm">
          <div className="text-red-700 dark:text-red-300">{error}</div>
        </div>
      )}

      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Performance List</h2>
            {selectedUnitName && (
              <p className="text-sm text-blue-600 dark:text-blue-400">Unit: {selectedUnitName}</p>
            )}
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
    </div>
  );
} 