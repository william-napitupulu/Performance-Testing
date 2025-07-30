import React from 'react';

interface Breadcrumb {
    label: string;
    href: string | null;
}

interface DocumentationBreadcrumbsProps {
    breadcrumbs: Breadcrumb[];
}

export default function DocumentationBreadcrumbs({ breadcrumbs }: DocumentationBreadcrumbsProps) {
    return (
        <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="inline-flex items-center">
                        {index > 0 && (
                            <svg className="w-3 h-3 text-gray-400 dark:text-gray-500 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                            </svg>
                        )}
                        {crumb.href ? (
                            <a href={crumb.href} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                {crumb.label}
                            </a>
                        ) : (
                            <span className="text-gray-800 dark:text-gray-200 font-medium">
                                {crumb.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}