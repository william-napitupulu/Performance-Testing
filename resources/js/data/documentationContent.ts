/**
 * Documentation Content Organization
 * 
 * This file provides a centralized structure for documentation content
 * with proper typing and organization for easy maintenance and updates.
 */

export interface DocumentationSection {
    heading: string;
    content: string;
}

export interface DocumentationPage {
    title: string;
    description: string;
    sections: DocumentationSection[];
}

export interface DocumentationCategory {
    title: string;
    pages: Record<string, DocumentationPage>;
}

/**
 * CSS Classes for Documentation Styling
 * Modular classes for easy customization
 */
export const documentationStyles = {
    // Content containers
    mainContainer: 'max-w-4xl mx-auto px-8 py-12',
    sectionContainer: 'mb-12',
    
    // Typography
    pageTitle: 'text-4xl font-bold text-gray-900 dark:text-white mb-4',
    pageDescription: 'text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12',
    sectionHeading: 'text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 scroll-mt-20',
    contentText: 'text-gray-700 dark:text-gray-300 leading-relaxed space-y-4',
    
    // Lists and formatting
    bulletPoint: 'flex items-start space-x-3 ml-4',
    bulletIcon: 'text-red-500 dark:text-red-400 font-bold mt-1',
    numberedList: 'flex items-start space-x-3 ml-4',
    numberedIcon: 'text-red-500 dark:text-red-400 font-semibold mt-1 min-w-[20px]',
    subBullet: 'flex items-start space-x-3 ml-8',
    subBulletIcon: 'text-gray-400 dark:text-gray-500 font-bold mt-1',
    
    // Code and technical content
    codeBlock: 'bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 ml-4 font-mono text-sm',
    inlineCode: 'bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 font-mono text-sm',
    
    // Interactive elements
    link: 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline',
    button: 'inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors',
    
    // Layout helpers
    spacer: 'h-4',
    divider: 'border-t border-gray-200 dark:border-gray-700 my-8',
    
    // Status indicators
    statusSuccess: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    statusWarning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    statusError: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    
    // Cards and containers
    infoCard: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6',
    warningCard: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6',
    errorCard: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6',
    successCard: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6',
};

/**
 * Documentation structure with proper organization
 */
export const documentationStructure = {
    'getting-started': {
        title: 'Getting Started',
        pages: {
            'overview': 'System Overview',
            'installation': 'Installation Guide',
            'quick-start': 'Quick Start Guide',
            'system-requirements': 'System Requirements'
        }
    },
    'user-manual': {
        title: 'User Manual',
        pages: {
            'authentication': 'Authentication & Login',
            'unit-selection': 'Unit Selection',
            'performance-management': 'Performance Management',
            'data-analysis': 'Data Analysis',
            'anomaly-detection': 'Anomaly Detection',
            'content-management': 'Content Management'
        }
    },
    'api-reference': {
        title: 'API Reference',
        pages: {
            'authentication-api': 'Authentication API',
            'performance-api': 'Performance API',
            'data-analysis-api': 'Data Analysis API',
            'units-api': 'Units API'
        }
    },
    'deployment': {
        title: 'Deployment',
        pages: {
            'docker-setup': 'Docker Setup',
            'environment-configuration': 'Environment Configuration',
            'database-setup': 'Database Setup',
            'production-deployment': 'Production Deployment'
        }
    },
    'troubleshooting': {
        title: 'Troubleshooting',
        pages: {
            'common-issues': 'Common Issues',
            'error-codes': 'Error Codes',
            'logs-debugging': 'Logs & Debugging',
            'faq': 'Frequently Asked Questions'
        }
    },
    'about': {
        title: 'About',
        pages: {
            'credits': 'Credits',
            'license': 'License',
            'changelog': 'Changelog',
            'contact': 'Contact Information'
        }
    }
};

/**
 * Helper functions for content formatting
 */
export const contentHelpers = {
    /**
     * Format a bullet point list
     */
    formatBulletList: (items: string[]): string => {
        return items.map(item => `• ${item}`).join('\n');
    },
    
    /**
     * Format a numbered list
     */
    formatNumberedList: (items: string[]): string => {
        return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
    },
    
    /**
     * Format code blocks
     */
    formatCodeBlock: (code: string, language?: string): string => {
        return `\`\`\`${language || ''}\n${code}\n\`\`\``;
    },
    
    /**
     * Format API endpoint documentation
     */
    formatApiEndpoint: (method: string, path: string, description: string): string => {
        return `**${method.toUpperCase()}** \`${path}\`\n\n${description}`;
    },
    
    /**
     * Format response examples
     */
    formatResponse: (statusCode: number, body: object): string => {
        return `**Response ${statusCode}:**\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\``;
    }
};

/**
 * Content validation helpers
 */
export const contentValidation = {
    /**
     * Validate section structure
     */
    validateSection: (section: DocumentationSection): boolean => {
        return !!(section.heading && section.content && 
                 section.heading.trim().length > 0 && 
                 section.content.trim().length > 0);
    },
    
    /**
     * Validate page structure
     */
    validatePage: (page: DocumentationPage): boolean => {
        return !!(page.title && page.description && page.sections &&
                 page.title.trim().length > 0 &&
                 page.description.trim().length > 0 &&
                 Array.isArray(page.sections) &&
                 page.sections.every(section => contentValidation.validateSection(section)));
    }
};