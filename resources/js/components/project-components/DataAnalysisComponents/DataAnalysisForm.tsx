import { useState } from 'react';
import { Calendar, Search, Hash } from 'lucide-react';

interface DataAnalysisFormProps {
  onSubmit: (data: { id: string; description: string; dateTime: string }) => void;
  loading: boolean;
}

export function DataAnalysisForm({ onSubmit, loading }: DataAnalysisFormProps) {
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = () => {
    if (!id.trim()) {
      alert('Please enter an ID');
      return;
    }
    
    if (!dateTime) {
      alert('Please select date and time');
      return;
    }

    onSubmit({ id: id.trim(), description: description.trim(), dateTime });
  };

  return (
    <div className="mb-6 rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-medium text-foreground dark:text-white mb-4">Analysis Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID and Description Field */}
          <div className="flex flex-col gap-4">
            {/* ID Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter ID..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter analysis description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 resize-none"
              />
            </div>
          </div>

          {/* Date and Time Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date and Time
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="datetime-local"
                id="datetime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setDateTime(getCurrentDateTime())}
              className="mt-2 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline self-start"
            >
              Use current date/time
            </button>
          </div>
        </div>

        {/* Get Data Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Get Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 