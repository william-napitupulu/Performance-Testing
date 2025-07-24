export function DataAnalysisHeader() {
    return (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm dark:border-green-800/50 dark:bg-green-900/10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-green-700 dark:text-green-300">Data Analysis</h2>
                        <p className="mt-1 text-sm text-green-600 dark:text-green-400">Compare reference data with existing measurements</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
