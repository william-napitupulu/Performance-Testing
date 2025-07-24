import { Save } from 'lucide-react';
import React from 'react';

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
                className={`inline-flex items-center rounded-lg px-6 py-3 font-medium transition-colors ${
                    saving || !hasDataToSave
                        ? 'cursor-not-allowed bg-gray-400 text-gray-600'
                        : 'bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg'
                } `}
            >
                {saving ? (
                    <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Manual Input Data
                    </>
                )}
            </button>
        </div>
    );
};
