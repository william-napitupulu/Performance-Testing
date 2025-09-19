import { Baseline } from '@/data/baselineData';
import { useState, useEffect } from 'react';
import { BaselineDetailsTable } from './BaselineDetailsTable';
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface BaselineDetailsContainerProps {
    baseline: Baseline;
}

export function BaselineDetailsContainer({ baseline }: BaselineDetailsContainerProps) {
    // The details are nested in the baseline object
    const baselineDetails = baseline.details || [];
    
    const [filteredData, setFilteredData] = useState(baselineDetails);

    // 1. Add a new loading state for the button
    const [isSettingDefault, setIsSettingDefault] = useState(false);

    // 2. Create the handler function to call the new route
    const handleSetDefault = () => {
        if (!baseline) return;

        // Use Inertia's router to make a POST request
        router.post(route('api.baseline.set-default', baseline.reff_id), {}, {
            onStart: () => setIsSettingDefault(true),
            onSuccess: (page) => {
                if (page.props.flash?.success) {
                    toast.success(page.props.flash.success as string);
                }
            },
            onError: () => {
                toast.error('Failed to set default baseline.');
            },
            onFinish: () => setIsSettingDefault(false),
        });
    };
    
    // You can add sorting and filtering state and handlers here just like you did for other tables.

    useEffect(() => {
        setFilteredData(baseline.details || []);
    }, [baseline.details]);
    
    return (
        <div className="p-6">

            {!baseline.reff_id ? (
                <div className="border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:border-orange-400 dark:from-orange-900/20 dark:to-red-900/20">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                        <div>
                            <h3 className="font-semibold text-orange-800 dark:text-orange-200">No Performance Test Output Selected</h3>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                                Please select a performance from the test output page or run an analysis to get an output of performance test.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                    {/* Content */}
                    <div className="p-6">
                        <div className="border-b border-gray-200 pb-4 mb-6 dark:border-gray-700">
                             <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                                <Info className="mr-2 h-5 w-5 text-gray-500" />
                                Baseline Information
                            </h3>
                        </div>

                        {/* Main grid for details and actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Left Side: Information List */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center">
                                    <span className="w-28 text-sm font-semibold text-gray-500 dark:text-gray-400">ID</span>
                                    <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{baseline?.reff_id || 'N/A'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 text-sm font-semibold text-gray-500 dark:text-gray-400">Created</span>
                                    <span className="text-sm text-gray-800 dark:text-gray-200">
                                        {performance ? new Date(baseline.date_created).toLocaleString('en-GB') : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-start">
                                    <span className="w-28 flex-shrink-0 text-sm font-semibold text-gray-500 dark:text-gray-400">Description</span>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{baseline?.description || 'No description provided.'}</p>
                                </div>
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div className="md:col-span-1 flex flex-col justify-start gap-4">
                                {baseline?.is_default === 0 && (
                                    <Button
                                        onClick={handleSetDefault}
                                        disabled={isSettingDefault}
                                        className="group w-full md:w-auto transform bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:from-gray-500 disabled:to-gray-600 disabled:transform-none"
                                    >
                                        {isSettingDefault ? 'Setting...' : 'Set as Default'}
                                    </Button>
                                )}
                                {baseline?.is_default === 1 && (
                                    <div className="flex items-center justify-center rounded-md bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                        Current Default
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <BaselineDetailsTable data={filteredData} />
        </div>
    );
}