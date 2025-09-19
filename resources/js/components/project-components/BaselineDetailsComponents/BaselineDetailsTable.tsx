import React from 'react';
import { BaselineDetail } from '@/data/baselineData'; // You will need to define this type

interface BaselineDetailsTableProps {
    data: BaselineDetail[];
}

export function BaselineDetailsTable({ data }: BaselineDetailsTableProps) {
    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium">Output ID</th>
                        <th className="px-6 py-3 text-left font-medium">Description</th>
                        <th className="px-6 py-3 text-right font-medium">Value</th>
                        <th className="px-6 py-3 text-left font-medium">Unit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-8 text-gray-500">No details found for this baseline.</td></tr>
                    ) : (
                        data.map((detail) => (
                            <tr key={detail.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-mono">{detail.output_id}</td>
                                <td className="px-6 py-4">{detail.output_tag.description}</td>
                                <td className="px-6 py-4 text-right font-semibold">{detail.value}</td>
                                <td className="px-6 py-4">{detail.output_tag.satuan}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}