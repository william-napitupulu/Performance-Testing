import React, { useEffect, useState } from 'react';

export default function DocumentationFooter() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="mt-24 pt-12 ">
            <div className="relative">
                {/* Navigation links */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            Edit this page
                        </a>
                        <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            Report an issue
                        </a>
                    </div>
                    
                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                            title="Back to top"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                            </svg>
                            Back to top
                        </button>
                    )}
                </div>

                {/* Footer info */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Performance Testing - Anomaly Detection System</p>
                            <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
                        </div>
                        
                        <a
                            href="/performance"
                            className="inline-flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                            title="Back to Dashboard"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                            Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}