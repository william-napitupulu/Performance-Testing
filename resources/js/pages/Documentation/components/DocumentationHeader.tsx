import React from 'react';

interface DocumentationHeaderProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export default function DocumentationHeader({ darkMode, toggleDarkMode }: DocumentationHeaderProps) {
    return (
        <header className="bg-white dark:bg-black shadow-sm dark:border-b dark:border-gray-800 sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 lg:px-8 h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">PT</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">Performance Testing</span>
                        </div>
                        <span className="text-gray-400 dark:text-gray-500">|</span>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Documentation</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                                </svg>
                            )}
                        </button>

                        {/* Back to Dashboard Button */}
                        <a
                            href="/performance"
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Back to Dashboard"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                        </a>
                    </div>
                </div>
        </header>
    );
}