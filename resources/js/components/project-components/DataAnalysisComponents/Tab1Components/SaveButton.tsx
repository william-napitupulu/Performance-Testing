import React from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  saving: boolean;
  hasDataToSave: boolean;
  onSave: () => void;
  showButton: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ saving, hasDataToSave, onSave, showButton }) => {
  if (!showButton) return null;

  return (
    <div className="mt-6 flex justify-start">
      <button
        onClick={onSave}
        disabled={saving || !hasDataToSave}
        className={`
          inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors
          ${saving || !hasDataToSave
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
          }
        `}
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Manual Input Data
          </>
        )}
      </button>
    </div>
  );
}; 