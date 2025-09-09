import { Button } from '@/components/ui/button';
import { Performance } from '@/data/mockPerformanceData';
import { Plus } from 'lucide-react';
import { PerformanceAddRow } from './PerformanceAddRow';

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
    onAddNew,
    onCancelAdd,
    onNewFormChange,
    onAddFromServer,
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
                        className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            )}
        </div>
    );
}
