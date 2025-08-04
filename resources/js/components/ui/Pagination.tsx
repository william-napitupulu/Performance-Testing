import { Link } from '@inertiajs/react';
import { Performance } from '@/data/mockPerformanceData';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginatedLink {
    url: string | null;
    label: string;
    active?: boolean;
}

interface Paginator<TData> {
    data: TData[]; // The actual data isn't needed here, just its structure
    links: PaginatedLink[];
    total: number;
    current_page: number;
    from: number;
    to: number;
    per_page: number;
    first_page_url: string;
    last_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
}

function Pagination({ paginator }: { paginator: Paginator<Performance> }) {
    if (paginator.total <= paginator.per_page) return null;

    const pageNumberLinks = paginator.links.slice(1, -1);

    return (
        <div className="border-t border-border bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{paginator.from}</span> to <span className="font-medium">{paginator.to}</span> of{' '}
                    <span className="font-medium">{paginator.total}</span> records
                </div>
                <div className="flex items-center space-x-2">
                    <Link href={paginator.first_page_url || '#'} as="button" disabled={!paginator.prev_page_url} className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                        <ChevronsLeft className='h-4 w-4' />
                    </Link>
                    <Link href={paginator.prev_page_url || '#'} as="button" disabled={!paginator.prev_page_url} className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                        <ChevronLeft className='h-4 w-4' />
                    </Link>

                    {pageNumberLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.url || '#'}
                            className={`rounded-md border px-3 py-2 text-sm font-medium ${
                                link.active
                                    ? 'border-green-600 bg-green-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            as='button'
                            disabled={!link.url}
                        />
                    ))}

                    <Link href={paginator.next_page_url || '#'} as="button" disabled={!paginator.next_page_url} className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                        <ChevronRight className='h-4 w-4' />
                    </Link>
                    <Link href={paginator.last_page_url || '#'} as="button" disabled={!paginator.last_page_url} className="rounded-md border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                        <ChevronsRight className='h-4 w-4' />
                    </Link>
                </div>
            </div>
            
        </div>
        
    );
}

export { Pagination };