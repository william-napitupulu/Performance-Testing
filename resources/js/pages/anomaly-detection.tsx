import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function AnomalyDetection() {
    return (
        <AppLayout>
            <Head title="Performance Test - Anomaly Detection" />
            <div className="p-6 bg-background">
                {/* Header */}
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Anomaly Detection</h2>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Performance Testing Environment</p>
                        </div>
                    </div>
                </div>

                {/* Placeholder Content */}
                <div className="rounded-lg shadow-lg overflow-hidden bg-card dark:bg-gray-800 border border-border dark:border-gray-700">
                    <div className="p-8 text-center">
                        <div className="text-6xl mb-4">🔧</div>
                        <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
                            Anomaly Detection Module
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This is a placeholder for the anomaly detection functionality in the performance testing environment.
                        </p>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left max-w-md mx-auto">
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Performance Testing Notes:</h4>
                            <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
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