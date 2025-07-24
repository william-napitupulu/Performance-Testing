import { Calendar, CheckCircle, Hash, Plus } from 'lucide-react';
import { DataAnalysisForm } from './DataAnalysisForm';

interface SharedPerformanceData {
    description: string;
    dateTime: string;
    perfId?: number;
}

interface NewPerformanceTestTabProps {
    onSubmit: (data: { description: string; dateTime: string; type: string; weight: string }) => void;
    loading: boolean;
    sharedData: SharedPerformanceData;
}

export function NewPerformanceTestTab({ onSubmit, loading, sharedData }: NewPerformanceTestTabProps) {
    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-b-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 dark:from-blue-700 dark:to-indigo-700">
                    <div className="flex items-center gap-3">
                        <div className="rounded-b-lg bg-white/20 p-2">
                            <Plus className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Create New Performance Test</h2>
                            <p className="text-sm text-blue-100">Set up a new performance test with custom parameters and configurations</p>
                        </div>
                    </div>
                </div>

                {/* Current Performance Test Info */}
                {sharedData.dateTime && (
                    <div className="border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 dark:border-emerald-400 dark:from-emerald-900/20 dark:to-teal-900/20">
                        <div className="mb-4 flex items-start gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/50">
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Active Performance Test</h3>
                                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                                    A performance test is currently active with the following configuration:
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Description */}
                            <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-gray-800">
                                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    Test Description
                                </h4>
                                <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">{sharedData.description}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/50">
                                                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="mb-1 text-sm font-medium text-purple-700 dark:text-purple-300">Date & Time</h5>
                                            <p className="font-medium text-purple-900 dark:text-purple-100">
                                                {new Date(sharedData.dateTime).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-sm text-purple-600 dark:text-purple-400">
                                                {new Date(sharedData.dateTime).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {sharedData.perfId && (
                                    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:border-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                                                    <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 text-sm font-medium text-blue-700 dark:text-blue-300">Performance ID</h5>
                                                <p className="font-mono text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                    {sharedData.perfId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DataAnalysisForm onSubmit={onSubmit} loading={loading} />
        </div>
    );
}
