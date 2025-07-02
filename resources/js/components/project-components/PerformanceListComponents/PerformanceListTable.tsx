import { Performance } from '@/data/mockPerformanceData';
import { PerformanceTableHeader } from './PerformanceTableHeader';
import { PerformanceTableRow } from './PerformanceTableRow';
import { PerformanceListFilters } from './PerformanceListFilters';

interface PerformanceListTableProps {
  data: Performance[];
  allData: Performance[];
  editingId: number | null;
  editForm: Partial<Performance>;
  showEditTooltip: boolean;
  editTooltipMessage: string;
  onEdit: (performance: Performance) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onEditFormChange: (field: keyof Performance, value: string | number) => void;
  onSort: (field: keyof Performance) => void;
  onFilteredDataChange: (data: Performance[]) => void;
  sortField: keyof Performance | null;
  sortDirection: 'asc' | 'desc' | null;
}

export function PerformanceListTable({
  data,
  allData,
  editingId,
  editForm,
  showEditTooltip,
  editTooltipMessage,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditFormChange,
  onSort,
  onFilteredDataChange,
  sortField,
  sortDirection
}: PerformanceListTableProps) {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-gray-700">
          <PerformanceTableHeader 
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection || 'asc'}
          />
          <tbody className="divide-y divide-border dark:divide-gray-700">
            <PerformanceListFilters
              performances={allData}
              onFilteredDataChange={onFilteredDataChange}
            />
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((performance) => (
                <PerformanceTableRow
                  key={performance.id}
                  performance={performance}
                  isEditing={editingId === performance.id}
                  editForm={editForm}
                  showEditTooltip={showEditTooltip && editingId === performance.id}
                  editTooltipMessage={editTooltipMessage}
                  onEdit={onEdit}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onDelete={onDelete}
                  onEditFormChange={onEditFormChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 