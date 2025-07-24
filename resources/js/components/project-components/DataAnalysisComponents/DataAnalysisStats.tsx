import type { AnalysisData, PerformanceRecord } from './types';

interface DataAnalysisStatsProps {
    data: AnalysisData[];
    performance?: PerformanceRecord;
}

export function DataAnalysisStats({ data, performance }: DataAnalysisStatsProps) {
    const totalRecords = data.length;
    const uniqueTagNumbers = new Set(data.map((item) => item.tag_no)).size;
    const calculateStats = () => {
        if (data.length === 0) {
            return {
                min: 'N/A',
                max: 'N/A',
                avg: 'N/A',
                stdDev: 'N/A',
            };
        }

        const numericValues = data
            .map((item) => (typeof item.value === 'number' ? item.value : parseFloat(String(item.value))))
            .filter((value) => !isNaN(value));

        if (numericValues.length === 0) {
            return {
                min: 'N/A',
                max: 'N/A',
                avg: 'N/A',
                stdDev: 'N/A',
            };
        }

        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        const sum = numericValues.reduce((acc, val) => acc + val, 0);
        const avg = sum / numericValues.length;

        // Calculate standard deviation
        const squareDiffs = numericValues.map((value) => Math.pow(value - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / numericValues.length;
        const stdDev = Math.sqrt(avgSquareDiff);

        const formatNumber = (num: number) => {
            if (Math.abs(num) < 0.000001) {
                return num.toExponential(6);
            }
            return num.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
            });
        };

        return {
            min: formatNumber(min),
            max: formatNumber(max),
            avg: formatNumber(avg),
            stdDev: formatNumber(stdDev),
        };
    };

    const stats = calculateStats();

    const getLatestDate = () => {
        if (data.length === 0) return 'N/A';
        const validDates = data
            .map((item) => item.date_rec)
            .filter((date): date is string => !!date)
            .map((date) => new Date(date))
            .filter((date) => !isNaN(date.getTime()));

        if (validDates.length === 0) return 'N/A';

        const latest = new Date(Math.max(...validDates.map((d) => d.getTime())));
        return latest.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-4">
            {/* Performance Record Information */}
            {performance && (
                <div className="overflow-hidden rounded-lg border border-green-200 bg-green-50 shadow-lg dark:border-green-800/50 dark:bg-green-900/10">
                    <div className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 dark:border-green-800/50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">Created Performance Record</h3>
                    </div>
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border border-green-200 bg-white p-3 dark:border-green-800/50 dark:bg-gray-800">
                                <div className="text-sm font-medium text-green-600 dark:text-green-400">Performance ID</div>
                                <div className="text-lg font-bold text-green-900 dark:text-green-100">#{performance.id}</div>
                            </div>
                            <div className="rounded-lg border border-green-200 bg-white p-3 dark:border-green-800/50 dark:bg-gray-800">
                                <div className="text-sm font-medium text-green-600 dark:text-green-400">Unit</div>
                                <div className="text-lg font-bold text-green-900 dark:text-green-100">{performance.unit_name}</div>
                            </div>
                            <div className="rounded-lg border border-green-200 bg-white p-3 dark:border-green-800/50 dark:bg-gray-800">
                                <div className="text-sm font-medium text-green-600 dark:text-green-400">Status</div>
                                <div className="text-lg font-bold text-green-900 dark:text-green-100">{performance.status}</div>
                            </div>
                            <div className="rounded-lg border border-green-200 bg-white p-3 dark:border-green-800/50 dark:bg-gray-800">
                                <div className="text-sm font-medium text-green-600 dark:text-green-400">Date Created</div>
                                <div className="text-sm font-bold text-green-900 dark:text-green-100">{performance.date_created}</div>
                            </div>
                        </div>
                        <div className="mt-3 rounded-lg border border-green-200 bg-white p-3 dark:border-green-800/50 dark:bg-gray-800">
                            <div className="text-sm font-medium text-green-600 dark:text-green-400">Description</div>
                            <div className="text-base font-medium text-green-900 dark:text-green-100">{performance.description}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Statistics */}
            <div className="overflow-hidden rounded-lg border border-blue-200 bg-blue-50 shadow-lg dark:border-blue-800/50 dark:bg-blue-900/10">
                <div className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 dark:border-blue-800/50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Analysis Statistics</h3>
                </div>
                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800/50 dark:bg-gray-800">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Records</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalRecords}</div>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800/50 dark:bg-gray-800">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Unique Tags</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{uniqueTagNumbers}</div>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800/50 dark:bg-gray-800">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Avg Value</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.avg}</div>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800/50 dark:bg-gray-800">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Min Value</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.min}</div>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800/50 dark:bg-gray-800">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Max Value</div>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.max}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-blue-100 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Minimum</div>
                    <div className="font-mono text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.min}</div>
                </div>
                <div className="rounded-lg border border-blue-100 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Maximum</div>
                    <div className="font-mono text-lg font-semibold text-emerald-600 dark:text-emerald-400">{stats.max}</div>
                </div>
                <div className="rounded-lg border border-blue-100 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Average</div>
                    <div className="font-mono text-lg font-semibold text-violet-600 dark:text-violet-400">{stats.avg}</div>
                </div>
                <div className="rounded-lg border border-blue-100 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">Standard Deviation</div>
                    <div className="font-mono text-lg font-semibold text-amber-600 dark:text-amber-400">{stats.stdDev}</div>
                </div>
            </div>
        </div>
    );
}
