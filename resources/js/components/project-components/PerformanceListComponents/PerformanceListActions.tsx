import { Performance } from '@/data/mockPerformanceData';
import { Button } from '@/components/ui/button';
import { PerformanceAddRow } from './PerformanceAddRow';
import { Plus } from 'lucide-react';

interface PerformanceListActionsProps {
  isAddingNew: boolean;
  newForm: Partial<Performance>;
  showTooltip: boolean;
  tooltipMessage: string;
  selectedUnitName?: string;
  onAddNew: () => void;
  onCancelAdd: () => void;
  onNewFormChange: (field: keyof Performance, value: string | number) => void;
  onAddFromServer: () => void;
  setIsAddingNew: (value: boolean) => void;
}

export function PerformanceListActions({
  isAddingNew,
  newForm,
  showTooltip,
  tooltipMessage,
  selectedUnitName,
  onAddNew,
  onCancelAdd,
  onNewFormChange,
  onAddFromServer,
  setIsAddingNew
}: PerformanceListActionsProps) {
  return (
    <div className="mt-4">
      {isAddingNew ? (
        <PerformanceAddRow
          newForm={newForm}
          showTooltip={showTooltip}
          tooltipMessage={tooltipMessage}
          onNewFormChange={onNewFormChange}
          onAddNew={onAddNew}
          onCancelAdd={onCancelAdd}
        />
      ) : (
        <div className="flex justify-end">
          {/* Commented out Add New Record button for now
          <Button 
            onClick={() => setIsAddingNew(true)}
            variant="default"
          >
            Add New Record
          </Button>
          */}
          <Button 
            onClick={onAddFromServer}
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
} 