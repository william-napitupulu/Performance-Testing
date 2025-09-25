import { AlertTriangle, Calendar, Hash, Info } from 'lucide-react';
import React from 'react';

interface SharedPerformanceData {
    description: string;
    dateTime: string;
    perfId?: number;
}

interface PerformanceInfoProps {
    sharedData: SharedPerformanceData;
}

export const PerformanceInfo: React.FC<PerformanceInfoProps> = ({ sharedData }) => {
    if (!sharedData.dateTime) {
        return (
            <div className="mb-6 border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:border-orange-400 dark:from-orange-900/20 dark:to-red-900/20">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                    <div>
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200">No Performance Test Selected</h3>
                        <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                            Please choose a performance from the Performance Test List or create a new one to begin your analysis.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <div className="overflow-hidden rounded-b-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 dark:from-blue-700 dark:to-indigo-700">
                    <div className="flex items-center gap-3">
                        <div className="rounded-b-lg bg-white/20 p-2">
                            <Info className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Performance Test Details</h2>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Description */}
                        <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-gray-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-gray-800">
                            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                Test Description
                            </h3>
                            <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">{sharedData.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Date/Time */}
                            <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/50">
                                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-sm font-medium text-purple-700 dark:text-purple-300">Date & Time</h4>
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

                            {/* Performance ID */}
                            {sharedData.perfId && (
                                <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 dark:border-emerald-700 dark:from-emerald-900/20 dark:to-teal-900/20">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/50">
                                                <Hash className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">Performance ID</h4>
                                            <p className="font-mono text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                                                {sharedData.perfId}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
