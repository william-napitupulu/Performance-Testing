import React from 'react';

interface DocumentationSection {
    title: string;
    sections: Record<string, string>;
}

interface DocumentationSections {
    [key: string]: DocumentationSection;
}

interface DocumentationSidebarProps {
    sections: DocumentationSections;
    currentSection: string;
    currentPage: string;
}

export default function DocumentationSidebar({ sections, currentSection, currentPage }: DocumentationSidebarProps) {
    return (
        <aside className="w-80 bg-gray-50 dark:bg-black sticky top-0 h-screen overflow-y-auto flex-shrink-0">
            <div className="px-6 py-8">
                <nav className="space-y-8">
                    {Object.entries(sections).map(([sectionKey, section]) => (
                        <div key={sectionKey}>
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                                {section.title}
                            </h3>
                            <ul className="space-y-1">
                                {Object.entries(section.sections).map(([pageKey, pageTitle]) => (
                                    <li key={pageKey}>
                                        <a
                                            href={`/documentation/${sectionKey}/${pageKey}`}
                                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                                                currentSection === sectionKey && currentPage === pageKey
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-r-2 border-red-500 dark:border-red-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {pageTitle}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}