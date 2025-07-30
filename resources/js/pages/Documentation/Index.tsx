import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import DocumentationHeader from './components/DocumentationHeader';
import DocumentationSidebar from './components/DocumentationSidebar';
import DocumentationContent from './components/DocumentationContent';
import DocumentationFooter from './components/DocumentationFooter';

interface DocumentationSection {
    title: string;
    sections: Record<string, string>;
}

interface DocumentationSections {
    [key: string]: DocumentationSection;
}

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

interface Props {
    sections: DocumentationSections;
    currentSection: string;
    currentPage: string;
    content: Content;
    breadcrumbs: Breadcrumb[];
}

export default function Documentation({ 
    sections, 
    currentSection, 
    currentPage, 
    content, 
    breadcrumbs 
}: Props) {
    const [darkMode, setDarkMode] = useState(false);

    // Initialize dark mode from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('documentation-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
    }, []);

    // Apply dark mode to document
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('documentation-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('documentation-theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <>
            <Head title="Documentation" />
            
            <div className="min-h-screen bg-white dark:bg-black">
                <div className="max-w-screen-2xl mx-auto">
                    <DocumentationHeader 
                        darkMode={darkMode} 
                        toggleDarkMode={toggleDarkMode} 
                    />
                    
                    <div className="flex">
                        <DocumentationSidebar 
                            sections={sections}
                            currentSection={currentSection}
                            currentPage={currentPage}
                        />
                        
                        <DocumentationContent 
                            content={content}
                            breadcrumbs={breadcrumbs}
                        />
                    </div>
                    
                    <DocumentationFooter />
                </div>
            </div>
        </>
    );
}