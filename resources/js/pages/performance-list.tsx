import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Database } from 'lucide-react';
import React from 'react';
import { Performance } from '@/data/mockPerformanceData';
import { 
  PerformanceTableHeader,
  PerformanceSearchFilters,
  PerformanceTableRow,
  PerformanceAddRow
} from '@/components/project-components';
import { getCurrentDateString } from '@/utils';
import { router } from '@inertiajs/react';

interface PerformanceListProps {
  performances: Performance[];
  selectedUnit: number;
  selectedUnitName?: string;
  error?: string;
}

export default function PerformanceList({ performances: initialPerformances = [], selectedUnit, selectedUnitName, error }: PerformanceListProps) {
  const [performances] = useState<Performance[]>(initialPerformances);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Performance>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newForm, setNewForm] = useState<Partial<Performance>>({
    description: '',
    status: 'Editable' as const,
    date_perfomance: getCurrentDateString(),
    unit_id: selectedUnit || 1
  });

  // Tooltip state for validation messages
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [editTooltipMessage, setEditTooltipMessage] = useState('');

  // Search state
  const [searchValues, setSearchValues] = useState({
    id: '',
    description: '',
    status: '',
    date_perfomance: '',
    date_created: '',
    unit_name: ''
  });

  // Sort state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Performance | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    const filtered = performances.filter(perf => {
      const matchesId = searchValues.id === '' || perf.id.toString().includes(searchValues.id);
      const matchesDescription = searchValues.description === '' || perf.description.toLowerCase().includes(searchValues.description.toLowerCase());
      const matchesStatus = searchValues.status === '' || perf.status === searchValues.status;
      const matchesDatePerformance = searchValues.date_perfomance === '' || perf.date_perfomance === searchValues.date_perfomance;
      const matchesDateCreated = searchValues.date_created === '' || perf.date_created.startsWith(searchValues.date_created);
      const matchesUnitName = searchValues.unit_name === '' || (perf.unit_name && perf.unit_name.toLowerCase().includes(searchValues.unit_name.toLowerCase()));
      
      return matchesId && matchesDescription && matchesStatus && matchesDatePerformance && matchesDateCreated && matchesUnitName;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        
        // Handle undefined values
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [performances, searchValues, sortConfig]);

  // Get next available ID
  const getNextId = () => {
    return Math.max(...performances.map(p => p.id), 0) + 1;
  };

  // Handle sorting
  const handleSort = (key: keyof Performance) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Search handlers
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues(prev => ({ ...prev, id: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues(prev => ({ ...prev, description: e.target.value }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchValues(prev => ({ ...prev, status: e.target.value }));
  };

  const handleDatePerformanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues(prev => ({ ...prev, date_perfomance: e.target.value }));
  };

  const handleDateCreatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues(prev => ({ ...prev, date_created: e.target.value }));
  };

  const handleUnitNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues(prev => ({ ...prev, unit_name: e.target.value }));
  };

  // Handle edit start
  const handleEdit = (performance: Performance) => {
    if (performance.status === 'Editable') {
      setEditingId(performance.id);
      setEditForm({
        description: performance.description,
        status: performance.status,
        date_perfomance: performance.date_perfomance,
        unit_id: performance.unit_id
      });
    }
  };

  // Handle edit save
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

        // Refresh the page to get updated data
        router.reload();

      } catch (error) {
        console.error('Error updating performance:', error);
        setEditTooltipMessage('Failed to update performance record');
        setShowEditTooltip(true);
        setTimeout(() => setShowEditTooltip(false), 3000);
      }
    }
  };

  // Handle edit cancel
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    const performance = performances.find(p => p.id === id);
    if (performance && performance.status === 'Editable') {
      if (window.confirm('Are you sure you want to delete this performance record?')) {
        try {
          await router.delete(`/performance/${id}`);
          
          // Refresh the page to get updated data
          router.reload();

        } catch (error) {
          console.error('Error deleting performance:', error);
          alert('Failed to delete performance record');
        }
      }
    }
  };

  // Handle add new
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
        
        // Refresh the page to get updated data
        router.reload();

      } catch (error) {
        console.error('Error adding performance:', error);
        setTooltipMessage('Failed to add performance record');
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }
    }
  };

  // Handle cancel add
  const handleCancelAdd = () => {
    setNewForm({
      description: '',
      status: 'Editable' as const,
      date_perfomance: getCurrentDateString(),
      unit_id: selectedUnit || 1
    });
    setIsAddingNew(false);
  };

  // Form change handlers
  const handleEditFormChange = (field: keyof Performance, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNewFormChange = (field: keyof Performance, value: string | number) => {
    setNewForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle add from server
  const handleAddFromServer = () => {
    router.visit('/data-analysis');
  };

  return (
    <AppLayout>
      <Head title="Performance Test - Performance List" />
      <div className="p-6 bg-background">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/50 shadow-sm">
            <div className="text-red-700 dark:text-red-300">{error}</div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Performance List</h2>
              {selectedUnitName && (
                <p className="text-sm text-blue-600 dark:text-blue-400">Unit: {selectedUnitName}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Records:</div>
              <div className="font-semibold text-blue-700 dark:text-blue-300">{filteredAndSortedData.length} / {performances.length}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-gray-700">
              
              {/* Main Header */}
              <PerformanceTableHeader onSort={handleSort} />
              
              <tbody className="divide-y divide-border dark:divide-gray-700">
                {/* Search Filter Row */}
                <PerformanceSearchFilters
                  searchValues={searchValues}
                  onIdChange={handleIdChange}
                  onDescriptionChange={handleDescriptionChange}
                  onStatusChange={handleStatusChange}
                  onDatePerformanceChange={handleDatePerformanceChange}
                  onDateCreatedChange={handleDateCreatedChange}
                  onUnitNameChange={handleUnitNameChange}
                />
                {/* Data Rows */}
                {filteredAndSortedData.map((performance, index) => (
                  <PerformanceTableRow
                    key={performance.id}
                    performance={performance}
                    isEditing={editingId === performance.id}
                    editForm={editForm}
                    showEditTooltip={showEditTooltip && editingId === performance.id}
                    editTooltipMessage={editTooltipMessage}
                    onEdit={handleEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onDelete={handleDelete}
                    onEditFormChange={handleEditFormChange}
                  />
                ))}
                
                {/* Add new row */}
                {isAddingNew && (
                  <PerformanceAddRow
                    newForm={newForm}
                    showTooltip={showTooltip}
                    tooltipMessage={tooltipMessage}
                    selectedUnitName={selectedUnitName}
                    onNewFormChange={handleNewFormChange}
                    onAddNew={handleAddNew}
                    onCancelAdd={handleCancelAdd}
                  />
                )}
              </tbody>
            </table>
          </div>
          
          {/* Add Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-border dark:border-gray-600 flex justify-end gap-3">
            <button
              onClick={handleAddFromServer}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <Database className="h-4 w-4" />
              Add from server
            </button>
            <button
              onClick={() => setIsAddingNew(true)}
              disabled={isAddingNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              Add 
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
