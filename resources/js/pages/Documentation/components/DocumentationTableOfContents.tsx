import React, { useEffect, useState } from 'react';

interface ContentSection {
    heading: string;
    content: string;
}

interface DocumentationTableOfContentsProps {
    sections: ContentSection[];
}

export default function DocumentationTableOfContents({ sections }: DocumentationTableOfContentsProps) {
    const [activeSection, setActiveSection] = useState<string>('');

    // Convert heading to anchor ID
    const createId = (heading: string) => {
        return heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    // Handle scroll to section
    const scrollToSection = (heading: string) => {
        const id = createId(heading);
        const element = document.getElementById(id);
        
        if (element) {
            const elementTop = element.offsetTop;
            window.scrollTo({
                top: elementTop - 80, // Offset for better positioning
                behavior: 'smooth'
            });
        }
    };

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map(section => ({
                id: createId(section.heading),
                element: document.getElementById(createId(section.heading))
            })).filter(item => item.element);

            if (sectionElements.length === 0) return;

            const scrollTop = window.scrollY;
            
            // Find the section that's currently visible
            let current = sectionElements[0].id; // Default to first section

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];
                const element = section.element!;
                
                if (element.offsetTop <= scrollTop + 100) {
                    current = section.id;
                    break;
                }
            }
            
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    if (sections.length === 0) return null;

    return (
        <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
            <div className="p-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    On this page
                </h3>
                <nav className="space-y-1">
                    {sections.map((section) => {
                        const id = createId(section.heading);
                        const isActive = activeSection === id;
                        
                        return (
                            <button
                                key={section.heading}
                                onClick={() => scrollToSection(section.heading)}
                                className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                                    isActive
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium border-l-2 border-red-500 dark:border-red-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {section.heading}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}