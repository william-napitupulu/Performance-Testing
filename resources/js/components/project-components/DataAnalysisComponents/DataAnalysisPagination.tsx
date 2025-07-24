import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationInfo {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
}

interface DataAnalysisPaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
}

export function DataAnalysisPagination({ pagination, onPageChange }: DataAnalysisPaginationProps) {
    const { current_page, last_page, total, from, to } = pagination;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(last_page, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (total === 0) {
        return (
            <div className="border-t border-border bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-300">No results found</div>
            </div>
        );
    }

    return (
        <div className="border-t border-border bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
                    <span className="font-medium">{total}</span> results
                </div>

                <div className="flex items-center space-x-2">
                    {/* First page */}
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={current_page === 1}
                        className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </button>

                    {/* Previous page */}
                    <button
                        onClick={() => onPageChange(current_page - 1)}
                        disabled={current_page === 1}
                        className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`rounded-md border px-3 py-2 text-sm font-medium ${
                                page === current_page
                                    ? 'border-green-600 bg-green-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next page */}
                    <button
                        onClick={() => onPageChange(current_page + 1)}
                        disabled={current_page === last_page}
                        className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Last page */}
                    <button
                        onClick={() => onPageChange(last_page)}
                        disabled={current_page === last_page}
                        className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
