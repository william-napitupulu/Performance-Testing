import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AnomalyDetection() {
    return (
        <AppLayout>
            <Head title="Performance Test - Anomaly Detection" />
            <div className="bg-background p-6">
                {/* Header */}
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-800/50 dark:bg-blue-900/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Anomaly Detection</h2>
                            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">Performance Testing Environment</p>
                        </div>
                    </div>
                </div>

                {/* Placeholder Content */}
                <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-8 text-center">
                        <div className="mb-4 text-6xl">🔧</div>
                        <h3 className="mb-2 text-xl font-semibold text-foreground dark:text-white">Anomaly Detection Module</h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                            This is a placeholder for the anomaly detection functionality in the performance testing environment.
                        </p>
                        <div className="mx-auto max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-left dark:border-yellow-800 dark:bg-yellow-900/20">
                            <h4 className="mb-2 font-medium text-yellow-800 dark:text-yellow-300">Performance Testing Notes:</h4>
                            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                                <li>• Use this page to test system performance</li>
                                <li>• Implement mock data for load testing</li>
                                <li>• Monitor response times and memory usage</li>
                                <li>• Compare with production anomaly detection</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
