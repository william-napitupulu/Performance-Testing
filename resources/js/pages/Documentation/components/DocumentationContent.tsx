import React from 'react';
import DocumentationBreadcrumbs from './DocumentationBreadcrumbs';
import DocumentationTableOfContents from './DocumentationTableOfContents';


interface ContentSection {
    heading: string;
    content: string;
}

interface Content {
    title: string;
    description: string;
    sections: ContentSection[];
}

interface Breadcrumb {
    label: string;
    href: string | null;
}

interface DocumentationContentProps {
    content: Content;
    breadcrumbs: Breadcrumb[];
}

export default function DocumentationContent({ content, breadcrumbs }: DocumentationContentProps) {
    // Convert heading to anchor ID
    const createId = (heading: string) => {
        return heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    return (
        <div className="flex flex-1">
            <main className="flex-1">
                <div className="max-w-4xl mx-auto px-8 py-12">
                {/* Breadcrumbs */}
                <DocumentationBreadcrumbs breadcrumbs={breadcrumbs} />

                {/* Page Header */}
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {content.title}
                    </h1>
                    {content.description && (
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            {content.description}
                        </p>
                    )}
                </header>

                {/* Content */}
                <div className="prose prose-lg prose-red dark:prose-invert max-w-none">
                    {content.sections.map((section, index) => (
                        <section key={index} >
                            <h2 
                                id={createId(section.heading)}
                                className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 scroll-mt-20"
                            >
                                {section.heading}
                            </h2>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                                {section.content.split('\n').map((line, lineIndex) => {
                                    // Skip empty lines
                                    if (line.trim() === '') {
                                        return <div key={lineIndex} className="h-4"></div>;
                                    }
                                    
                                    // Handle bullet points
                                    if (line.startsWith('• ')) {
                                        return (
                                            <div key={lineIndex} className="flex items-start space-x-3 ml-4">
                                                <span className="text-red-500 dark:text-red-400 font-bold mt-1">•</span>
                                                <span className="flex-1">{line.substring(2)}</span>
                                            </div>
                                        );
                                    }
                                    
                                    // Handle numbered lists
                                    if (line.match(/^\d+\.\s/)) {
                                        const number = line.match(/^(\d+)\./)?.[1];
                                        const text = line.replace(/^\d+\.\s/, '');
                                        return (
                                            <div key={lineIndex} className="flex items-start space-x-3 ml-4">
                                                <span className="text-red-500 dark:text-red-400 font-semibold mt-1 min-w-[20px]">{number}.</span>
                                                <span className="flex-1">{text}</span>
                                            </div>
                                        );
                                    }
                                    
                                    // Handle sub-bullets (lines starting with spaces and bullet)
                                    if (line.match(/^\s+•/)) {
                                        return (
                                            <div key={lineIndex} className="flex items-start space-x-3 ml-8">
                                                <span className="text-gray-400 dark:text-gray-500 font-bold mt-1">•</span>
                                                <span className="flex-1">{line.trim().substring(2)}</span>
                                            </div>
                                        );
                                    }
                                    
                                    // Handle code-like content (lines with indentation or special formatting)
                                    if (line.match(/^\s{2,}/)) {
                                        return (
                                            <div key={lineIndex} className="bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 ml-4 font-mono text-sm">
                                                {line.trim()}
                                            </div>
                                        );
                                    }
                                    
                                    // Regular paragraphs
                                    return (
                                        <p key={lineIndex} className="text-base leading-7">
                                            {line}
                                        </p>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
                </div>
            </main>


            {/* Table of Contents - Right Sidebar */}
            <DocumentationTableOfContents sections={content.sections} />
        </div>
    );
}