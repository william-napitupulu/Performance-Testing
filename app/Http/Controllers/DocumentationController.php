<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentationController extends Controller
{
    /**
     * Documentation sections configuration
     */
    private function getDocumentationSections()
    {
        return [
            'getting-started' => [
                'title' => 'Getting Started',
                'sections' => [
                    'overview' => 'System Overview',
                    'installation' => 'Installation Guide',
                    'quick-start' => 'Quick Start Guide',
                    'system-requirements' => 'System Requirements'
                ]
            ],
            'user-manual' => [
                'title' => 'User Manual',
                'sections' => [
                    'authentication' => 'Authentication & Login',
                    'unit-selection' => 'Unit Selection',
                    'performance-management' => 'Performance Management',
                    'data-analysis' => 'Data Analysis',
                    'anomaly-detection' => 'Anomaly Detection',
                    'content-management' => 'Content Management'
                ]
            ],
            'api-reference' => [
                'title' => 'API Reference',
                'sections' => [
                    'authentication-api' => 'Authentication API',
                    'performance-api' => 'Performance API',
                    'data-analysis-api' => 'Data Analysis API',
                    'units-api' => 'Units API'
                ]
            ],
            'deployment' => [
                'title' => 'Deployment',
                'sections' => [
                    'docker-setup' => 'Docker Setup',
                    'environment-configuration' => 'Environment Configuration',
                    'database-setup' => 'Database Setup',
                    'production-deployment' => 'Production Deployment'
                ]
            ],
            'troubleshooting' => [
                'title' => 'Troubleshooting',
                'sections' => [
                    'common-issues' => 'Common Issues',
                    'error-codes' => 'Error Codes',
                    'logs-debugging' => 'Logs & Debugging',
                    'faq' => 'Frequently Asked Questions'
                ]
            ],
            'about' => [
                'title' => 'About',
                'sections' => [
                    'credits' => 'Credits',
                    'license' => 'License',
                    'changelog' => 'Changelog',
                    'contact' => 'Contact Information'
                ]
            ]
        ];
    }

    /**
     * Display the documentation index
     */
    public function index(Request $request, $section = null, $page = null)
    {
        $sections = $this->getDocumentationSections();
        
        // Default to getting-started/overview if no section specified
        if (!$section) {
            $section = 'getting-started';
            $page = 'overview';
        }
        
        // If section provided but no page, use first page of section
        if ($section && !$page) {
            $page = array_key_first($sections[$section]['sections'] ?? []);
        }
        
        // Validate section and page exist
        if (!isset($sections[$section]) || !isset($sections[$section]['sections'][$page])) {
            abort(404);
        }
        
        $content = $this->getPageContent($section, $page);
        
        return Inertia::render('Documentation/Index', [
            'sections' => $sections,
            'currentSection' => $section,
            'currentPage' => $page,
            'content' => $content,
            'breadcrumbs' => [
                ['label' => 'Documentation', 'href' => route('documentation.index')],
                ['label' => $sections[$section]['title'], 'href' => route('documentation.section', $section)],
                ['label' => $sections[$section]['sections'][$page], 'href' => null]
            ]
        ]);
    }

    /**
     * Get content for a specific documentation page
     */
    private function getPageContent($section, $page)
    {
        return $this->generateContent($section, $page);
    }

    /**
     * Generate content for documentation pages
     */
    private function generateContent($section, $page)
    {
        $content = [
            'title' => '',
            'description' => '',
            'sections' => []
        ];

        switch ($section) {
            case 'getting-started':
                $content = $this->getGettingStartedContent($page);
                break;
            case 'user-manual':
                $content = $this->getUserManualContent($page);
                break;
            case 'api-reference':
                $content = $this->getApiReferenceContent($page);
                break;
            case 'deployment':
                $content = $this->getDeploymentContent($page);
                break;
            case 'troubleshooting':
                $content = $this->getTroubleshootingContent($page);
                break;
            case 'about':
                $content = $this->getAboutContent($page);
                break;
        }

        return $content;
    }

    /**
     * Getting Started content
     */
    private function getGettingStartedContent($page)
    {
        switch ($page) {
            case 'overview':
                return [
                    'title' => 'System Overview',
                    'description' => 'Comprehensive platform for performance monitoring, data analysis, and anomaly detection',
                    'sections' => [
                        [
                            'heading' => 'What is Performance Testing System?',
                            'content' => 'The Performance Testing System is an enterprise-grade web application designed for real-time monitoring and analysis of industrial performance data. Built with modern technologies including Laravel 11, React 18, and Docker, it provides comprehensive tools for performance tracking, data visualization, and anomaly detection across multiple operational units.'
                        ],
                        [
                            'heading' => 'Core Features',
                            'content' => '• Real-time Performance Monitoring - Track key performance indicators across multiple units and systems
• Advanced Data Analysis - Comprehensive analytics with interactive charts and visualizations
• Anomaly Detection - Automated detection of performance deviations and alerts
• Multi-Unit Support - Manage and monitor different operational units from a single dashboard
• API Integration - RESTful APIs for external system integration and data exchange
• User Management - Role-based access control and authentication
• Export Capabilities - Generate reports and export data in multiple formats'
                        ],
                        [
                            'heading' => 'Technical Architecture',
                            'content' => 'The system follows a modern microservices architecture:

• Frontend: React 18 with TypeScript and Inertia.js for seamless SPA experience
• Backend: Laravel 11 with PHP 8.2 providing robust API endpoints
• Database: MySQL/MariaDB for reliable data persistence
• Containerization: Docker for consistent deployment across environments
• Authentication: Laravel Breeze with session-based authentication
• Styling: Tailwind CSS for responsive and modern UI design'
                        ],
                        [
                            'heading' => 'Who Should Use This System?',
                            'content' => 'This system is designed for:

• Operations Managers - Monitor overall performance and identify trends
• System Administrators - Manage user access and system configuration
• Data Analysts - Perform deep analysis of performance metrics
• Quality Assurance Teams - Track compliance and performance standards
• Technical Staff - Access real-time data for troubleshooting and optimization'
                        ]
                    ]
                ];
            case 'installation':
                return [
                    'title' => 'Installation Guide',
                    'description' => 'Complete setup instructions for development and production environments',
                    'sections' => [
                        [
                            'heading' => 'System Requirements',
                            'content' => 'Minimum system requirements:

• Operating System: Linux (Ubuntu 20.04+ recommended) or Windows 10/11
• Docker: Version 20.10+
• Docker Compose: Version 2.0+
• Memory: 4GB RAM (8GB+ recommended)
• Storage: 10GB available disk space
• Network: Internet connection for initial setup'
                        ],
                        [
                            'heading' => 'Prerequisites Installation',
                            'content' => '1. Install Docker
   • Ubuntu: sudo apt update && sudo apt install docker.io
   • Windows: Download Docker Desktop from docker.com

2. Install Docker Compose
   • Usually included with Docker Desktop
   • Linux: sudo apt install docker-compose

3. Install Git
   • Ubuntu: sudo apt install git
   • Windows: Download from git-scm.com

4. Verify installations:
   • docker --version
   • docker-compose --version
   • git --version'
                        ],
                        [
                            'heading' => 'Quick Installation',
                            'content' => '1. Clone the repository
   git clone <repository-url>
   cd Performance-Testing

2. Copy environment configuration
   cp .env.example .env

3. Configure database settings in .env file
   DB_HOST=your-database-host
   DB_DATABASE=performance_testing
   DB_USERNAME=your-username
   DB_PASSWORD=your-password

4. Build and start containers
   docker-compose up -d

5. Run database migrations
   docker exec -it performance-testing-app php artisan migrate

6. Access the application
   Open http://your-server-ip:8000 in your browser'
                        ],
                        [
                            'heading' => 'Troubleshooting Installation',
                            'content' => 'Common issues and solutions:

• Port conflicts: Change port mappings in docker-compose.yml
• Permission errors: Ensure Docker has proper permissions
• Database connection: Verify database credentials and network connectivity
• Asset build errors: Run npm install and npm run build locally first

For additional help, check the Troubleshooting section or contact support.'
                        ]
                    ]
                ];
            case 'quick-start':
                return [
                    'title' => 'Quick Start Guide',
                    'description' => 'Get up and running with the Performance Testing System in minutes',
                    'sections' => [
                        [
                            'heading' => 'First Login',
                            'content' => '1. Navigate to your application URL (e.g., http://your-server-ip:8000)
2. Click "Login" on the homepage
3. Enter your credentials provided by your system administrator
4. Upon successful login, you\'ll be redirected to unit selection'
                        ],
                        [
                            'heading' => 'Unit Selection',
                            'content' => 'After login, you must select an operational unit:

1. You\'ll see a dropdown list of available units based on your permissions
2. Select the unit you want to monitor
3. Click "Continue" to proceed to the main dashboard

Note: Your available units are determined by your user role and permissions set by the administrator.'
                        ],
                        [
                            'heading' => 'Dashboard Overview',
                            'content' => 'The main dashboard provides:• Performance Overview - Key metrics and current status• Navigation Menu - Access to all system features• Unit Selector - Switch between different units• User Menu - Profile settings and logout optionMain navigation includes:• Performance - Create and manage performance records• Data Analysis - Analyze historical and real-time data• Anomaly Detection - View detected anomalies and alerts• Content Management - Manage system content'
                        ],
                        [
                            'heading' => 'Creating Your First Performance Record',
                            'content' => '1. Navigate to "Performance" from the main menu2. Click "Create New Record" or the "+" button3. Fill in the required information:   • Record name and description   • Performance parameters   • Monitoring thresholds4. Save the record5. The system will begin monitoring based on your configuration'
                        ],
                        [
                            'heading' => 'Viewing Data Analysis',
                            'content' => '1. Go to "Data Analysis" section2. Select date range for analysis3. Choose performance parameters to analyze4. View interactive charts and graphs5. Export data if needed using the export buttonThe system provides real-time and historical data visualization with various chart types and filtering options.'
                        ]
                    ]
                ];
            case 'system-requirements':
                return [
                    'title' => 'System Requirements',
                    'description' => 'Detailed hardware and software requirements',
                    'sections' => [
                        [
                            'heading' => 'Server Requirements',
                            'content' => 'Production Environment:• CPU: 4+ cores (Intel/AMD x64)• Memory: 8GB RAM minimum, 16GB recommended• Storage: 50GB+ SSD storage• Network: 1Gbps network interface• OS: Ubuntu 20.04 LTS or CentOS 8+ (Linux recommended)Development Environment:• CPU: 2+ cores• Memory: 4GB RAM minimum• Storage: 20GB available space• Network: Broadband internet connection'
                        ],
                        [
                            'heading' => 'Software Dependencies',
                            'content' => 'Required Software:• Docker 20.10+ and Docker Compose 2.0+• Web Server: Apache (via Docker container)• Database: MySQL 8.0+ or MariaDB 10.6+• PHP: 8.2+ (via Docker container)• Node.js: 18+ (for asset compilation)Optional but Recommended:• Git for version control• SSL certificate for HTTPS• Backup solution for data protection• Monitoring tools (Prometheus, Grafana)'
                        ],
                        [
                            'heading' => 'Browser Compatibility',
                            'content' => 'Supported Browsers:• Chrome 90+ (Recommended)• Firefox 88+• Safari 14+• Edge 90+Browser Requirements:• JavaScript enabled• Cookies enabled• Local storage support• WebSocket support for real-time features• Modern CSS support (Flexbox, Grid)'
                        ],
                        [
                            'heading' => 'Network Requirements',
                            'content' => 'Network Configuration:• Inbound ports: 80 (HTTP), 443 (HTTPS), 8000 (application)• Outbound access for API integrations• Database port 3306 (if external database)• Internal network access between containersSecurity Considerations:• Firewall configuration• SSL/TLS encryption recommended• VPN access for remote users• Regular security updates'
                        ],
                        [
                            'heading' => 'Performance Considerations',
                            'content' => 'For optimal performance:• Use SSD storage for database• Ensure adequate RAM for concurrent users• Configure proper database indexing• Use CDN for static assets if needed• Regular database maintenance• Monitor system resources and scale as neededExpected Performance:• Supports 100+ concurrent users• Real-time data processing• Sub-second response times for most operations'
                        ]
                    ]
                ];
            default:
                return $this->getDefaultContent($page);
        }
    }

    /**
     * User Manual content
     */
    private function getUserManualContent($page)
    {
        switch ($page) {
            case 'authentication':
                return [
                    'title' => 'Authentication & Login',
                    'description' => 'Complete guide to user authentication, login process, and session management',
                    'sections' => [
                        [
                            'heading' => 'Login Process',
                            'content' => 'The authentication system provides secure access to the Performance Testing platform:

1. Navigate to the login page
   • Access your organization\'s Performance Testing URL
   • Click "Login" from the homepage
   • You\'ll be redirected to the secure login form

2. Enter your credentials
   • Username: Your assigned user ID (usually your employee ID or email)
   • Password: Your secure password provided by the administrator
   • Click "Sign In" to authenticate

3. Two-factor authentication (if enabled)
   • Enter the verification code from your authenticator app
   • Or confirm via SMS/email if configured

4. Successful login redirect
   • First-time users: Redirect to password change form
   • Returning users: Redirect to unit selection page
   • Admin users: Direct access to admin dashboard'
                        ],
                        [
                            'heading' => 'Session Management',
                            'content' => 'User sessions are managed with enterprise-grade security:

Session Duration:
• Standard sessions: 8 hours of activity
• Extended sessions: 24 hours (admin approval required)
• Automatic logout after 30 minutes of inactivity

Session Security Features:
• Encrypted session tokens with rotating keys
• IP address validation for session consistency
• Device fingerprinting for additional security
• Concurrent session limits (max 3 active sessions)

Session Persistence:
• "Remember Me" option extends session to 30 days
• Cross-tab session sharing within same browser
• Automatic session refresh during active use
• Secure session cleanup on browser close

Logout Options:
• Manual logout: Click user menu → "Sign Out"
• Logout all devices: Available in user settings
• Emergency logout: Contact system administrator'
                        ],
                        [
                            'heading' => 'Password Management',
                            'content' => 'Comprehensive password security and management:

Password Requirements:
• Minimum 12 characters length
• Must contain: uppercase, lowercase, numbers, special characters
• Cannot reuse last 5 passwords
• Password expiry: 90 days (configurable by admin)

Password Reset Process:
1. Click "Forgot Password" on login page
2. Enter your username/email address
3. Check your email for reset instructions
4. Follow the secure reset link (valid for 1 hour)
5. Create a new password meeting requirements
6. Confirm the new password and save

Self-Service Options:
• Change password from user settings
• View password expiry date
• Enable/disable login notifications
• Manage trusted devices list

Security Features:
• Account lockout after 5 failed attempts
• Progressive delay between login attempts
• Password strength indicator during creation
• Optional password manager integration'
                        ],
                        [
                            'heading' => 'User Roles and Permissions',
                            'content' => 'The system supports role-based access control:

Standard User Roles:
• Operator: Basic monitoring and data viewing
• Analyst: Advanced analysis and reporting capabilities  
• Supervisor: Team management and approval workflows
• Administrator: Full system configuration and user management

Permission Levels:
• Read-only: View data and reports
• Read-write: Modify records and configurations
• Approval: Authorize changes and workflows
• Admin: Full system control and user management

Plant-based Access:
• Multi-plant organizations have plant-specific access
• Users can be assigned to one or multiple plants
• Cross-plant access requires special permissions
• Plant administrators manage their unit users

Permission Inheritance:
• Higher roles include lower role permissions
• Temporary permission elevation available
• Audit trail for all permission changes
• Regular permission review reminders'
                        ]
                    ]
                ];
            case 'unit-selection':
                return [
                    'title' => 'Unit Selection',
                    'description' => 'Guide to selecting and managing operational units',
                    'sections' => [
                        [
                            'heading' => 'Understanding Units',
                            'content' => 'Units represent operational divisions within your organization:

What are Units?
• Physical plant locations or facilities
• Production lines or operational areas
• Equipment groups or system divisions
• Virtual organizational departments

Unit Hierarchy:
• Plant Level: Top-level organizational unit
• Unit Level: Specific operational divisions
• Sub-unit Level: Detailed equipment groups
• Component Level: Individual monitoring points

Unit Properties:
• Unique identification codes
• Descriptive names and locations
• Associated equipment and systems
• Performance monitoring configurations
• User access permissions and roles'
                        ],
                        [
                            'heading' => 'Selecting Your Unit',
                            'content' => 'After successful login, you must select an operational unit:

Available Units Display:
• Dropdown list shows units based on your permissions
• Units are grouped by plant (if multi-plant setup)
• Recently used units appear at the top
• Search functionality for quick unit finding

Selection Process:
1. Review the list of available units
2. Use the search box if you have many units
3. Click on your desired unit from the dropdown
4. Confirm your selection with "Continue" button
5. The system loads the unit-specific dashboard

Unit Information Display:
• Unit name and description
• Last access date and time
• Current operational status
• Associated equipment count
• Recent activity summary

Quick Actions:
• Switch units from the header dropdown
• Mark frequently used units as favorites
• View unit details and specifications
• Access unit-specific documentation'
                        ],
                        [
                            'heading' => 'Multi-Unit Access',
                            'content' => 'Managing access across multiple operational units:

Multi-Unit Permissions:
• Some users have access to multiple units
• Cross-unit data comparison capabilities
• Centralized reporting across units
• Unit-specific role assignments

Switching Between Units:
• Use the unit selector in the main navigation
• No need to logout/login when switching
• Session data persists across unit changes
• Recent unit history maintained

Global vs Unit Views:
• Global Dashboard: Overview of all accessible units
• Unit Dashboard: Focused view of selected unit
• Comparative Analysis: Side-by-side unit comparison
• Cross-Unit Reporting: Aggregate data across units

Unit Access Management:
• Request access to additional units
• Temporary access for special projects
• Access approval workflow process
• Regular access review and cleanup

Favorites and Bookmarks:
• Mark frequently used units as favorites
• Create custom unit groups and collections
• Quick access shortcuts in navigation
• Personalized unit dashboard layouts'
                        ]
                    ]
                ];
            case 'performance-management':
                return [
                    'title' => 'Performance Management',
                    'description' => 'Comprehensive guide to creating, managing, and monitoring performance records',
                    'sections' => [
                        [
                            'heading' => 'Performance Records Overview',
                            'content' => 'Performance records are the foundation of system monitoring:

What are Performance Records?
• Structured data collection templates
• Define monitoring parameters and thresholds
• Track key performance indicators (KPIs)
• Historical performance tracking and analysis

Record Types:
• Routine: Regular scheduled monitoring
• Before OH (Overhaul): Pre-maintenance baseline
• After OH: Post-maintenance verification
• Research: Special studies and investigations

Record Components:
• Identification: Name, description, and metadata
• Parameters: Measured values and units
• Thresholds: Normal operating ranges and limits
• Schedule: Frequency and timing configuration
• Status: Draft, Finished, or Archived states

Data Collection Methods:
• Manual entry: Operator input forms
• Automatic: System integration and sensors
• Hybrid: Combination of manual and automatic
• Import: Bulk data loading from external systems'
                        ],
                        [
                            'heading' => 'Creating Performance Records',
                            'content' => 'Step-by-step guide to creating new performance monitoring records:

Navigation and Access:
1. Go to "Performance" section from main menu
2. Click "Create New Record" or the "+" button
3. Ensure you have write permissions for the selected unit
4. Choose the appropriate record template

Basic Record Information:
• Record Name: Descriptive and unique identifier
• Description: Detailed explanation of monitoring purpose
• Record Type: Select from Routine, Before OH, After OH, Research
• Weight Classification: Beban 1, Beban 2, or Beban 3
• Scheduled Date: When monitoring should occur

Parameter Configuration:
• Select monitoring parameters from available list
• Define measurement units and precision
• Set normal operating ranges and thresholds
• Configure alarm limits and notification rules
• Add parameter descriptions and context

Advanced Settings:
• Data collection frequency and intervals
• Automatic calculation formulas
• Data validation rules and constraints
• Integration with external data sources
• Custom fields for specific requirements

Review and Activation:
• Preview record configuration
• Test data entry forms and calculations
• Verify threshold and alarm settings
• Save as draft or activate immediately
• Set up monitoring schedules and notifications'
                        ],
                        [
                            'heading' => 'Managing Existing Records',
                            'content' => 'Tools and procedures for managing performance records:

Record Listing and Search:
• View all records in organized table format
• Filter by date range, type, status, or owner
• Search by record name or description
• Sort by creation date, last update, or priority

Record Actions:
• View: Display record details and data
• Edit: Modify parameters and settings (if Draft)
• Copy: Create new record based on existing template
• Archive: Remove from active monitoring
• Delete: Permanently remove record and data

Status Management:
• Draft: Records can be modified and updated
• Finished: Records are finalized and protected
• Status change requires appropriate permissions
• Audit trail tracks all status changes

Bulk Operations:
• Select multiple records for batch actions
• Bulk status changes and updates
• Mass export of record configurations
• Batch archive or delete operations

Record History:
• View complete change history
• Track who made modifications and when
• Compare different versions of records
• Restore previous configurations if needed

Data Quality Control:
• Validate data integrity and completeness
• Identify and flag suspicious readings
• Automated quality checks and alerts
• Data correction and approval workflows'
                        ]
                    ]
                ];
            case 'data-analysis':
                return [
                    'title' => 'Data Analysis',
                    'description' => 'Advanced data analysis tools, visualization, and reporting capabilities',
                    'sections' => [
                        [
                            'heading' => 'Analysis Dashboard',
                            'content' => 'The Data Analysis section provides comprehensive analytical tools:

Dashboard Overview:
• Multi-tab interface for different analysis types
• Real-time and historical data visualization
• Interactive charts with zoom and filtering
• Customizable dashboard layouts

Available Analysis Types:
• Trend Analysis: Long-term performance patterns
• Comparative Analysis: Multi-period comparisons
• Statistical Analysis: Advanced statistical calculations
• Correlation Analysis: Relationship identification
• Anomaly Detection: Deviation identification

Data Sources:
• Performance records from selected unit
• Historical archived data
• Real-time streaming data
• External system integrations
• Manual data inputs and corrections

Visualization Options:
• Line charts for trend analysis
• Bar charts for comparative data
• Scatter plots for correlation analysis
• Heat maps for pattern identification
• Statistical distribution charts'
                        ],
                        [
                            'heading' => 'Interactive Charts and Graphs',
                            'content' => 'Advanced charting capabilities for data visualization:

Chart Types Available:
• Time Series: Performance trends over time
• Multi-axis: Multiple parameters on one chart
• Stacked Area: Cumulative performance metrics
• Box Plot: Statistical distribution analysis
• Waterfall: Sequential change visualization

Interactive Features:
• Zoom and pan functionality
• Data point hover information
• Click-to-drill-down capabilities
• Custom time range selection
• Parameter show/hide toggles

Chart Customization:
• Color scheme selection
• Axis scaling and labeling
• Grid line configuration
• Legend positioning
• Title and annotation editing

Export and Sharing:
• High-resolution image export (PNG, SVG)
• Data export to Excel/CSV formats
• Interactive chart sharing via URL
• Embed charts in reports and presentations
• Scheduled chart generation and distribution

Real-time Updates:
• Live data streaming integration
• Automatic chart refresh intervals
• Real-time threshold monitoring
• Dynamic scaling and adjustment
• Performance optimization for large datasets'
                        ],
                        [
                            'heading' => 'Statistical Analysis Tools',
                            'content' => 'Advanced statistical analysis and calculation tools:

Basic Statistics:
• Mean, median, mode calculations
• Standard deviation and variance
• Min/max values and ranges
• Percentile and quartile analysis
• Data distribution characteristics

Advanced Analytics:
• Regression analysis and trend fitting
• Correlation coefficient calculations
• Time series decomposition
• Seasonal pattern identification
• Forecasting and prediction models

Performance Indicators:
• Key Performance Indicator (KPI) tracking
• Performance baseline establishment
• Deviation analysis and scoring
• Efficiency ratio calculations
• Benchmark comparison analysis

Quality Control Statistics:
• Control chart generation
• Process capability analysis
• Statistical process control (SPC)
• Out-of-control point identification
• Quality trend analysis

Custom Calculations:
• Formula builder for custom metrics
• Multi-parameter calculations
• Conditional logic and rules
• Historical comparison calculations
• Performance rating algorithms'
                        ]
                    ]
                ];
            case 'anomaly-detection':
                return [
                    'title' => 'Anomaly Detection',
                    'description' => 'Automated anomaly detection, alert management, and investigation tools',
                    'sections' => [
                        [
                            'heading' => 'Anomaly Detection System',
                            'content' => 'Automated system for identifying performance anomalies:

Detection Algorithms:
• Threshold-based detection: Simple limit violations
• Statistical detection: Deviation from normal patterns
• Machine learning models: Pattern recognition algorithms
• Trend analysis: Rate of change detection
• Comparative analysis: Peer unit comparisons

Detection Sensitivity:
• Low: Only major deviations trigger alerts
• Medium: Balanced sensitivity for most applications
• High: Sensitive detection for critical systems
• Custom: User-defined sensitivity parameters
• Adaptive: Self-adjusting based on historical data

Real-time Monitoring:
• Continuous data stream analysis
• Immediate alert generation
• Automated notification distribution
• Integration with monitoring systems
• Performance impact minimization

Detection Categories:
• Critical: Immediate action required
• Warning: Investigation recommended
• Information: Minor deviation noted
• Maintenance: Predictive maintenance alerts
• System: Technical system issues'
                        ],
                        [
                            'heading' => 'Alert Management',
                            'content' => 'Comprehensive alert management and notification system:

Alert Types:
• Real-time alerts: Immediate notifications
• Scheduled alerts: Regular status reports
• Escalation alerts: Unacknowledged alert follow-ups
• Maintenance alerts: Preventive maintenance reminders
• System alerts: Technical status notifications

Notification Channels:
• Email notifications: Detailed alert information
• SMS messages: Critical alert summaries
• In-app notifications: Dashboard alert indicators
• Mobile push: Mobile app notifications
• Integration APIs: Third-party system alerts

Alert Configuration:
• Custom alert rules and conditions
• Notification recipient management
• Alert priority and severity levels
• Escalation timing and procedures
• Alert suppression during maintenance

Alert Workflow:
• Alert generation and classification
• Automatic notification distribution
• Acknowledgment and response tracking
• Investigation and resolution logging
• Alert closure and documentation

Alert Analytics:
• Alert frequency and pattern analysis
• Response time and efficiency metrics
• False positive identification and reduction
• Alert trend analysis and reporting
• System performance optimization'
                        ]
                    ]
                ];
            case 'content-management':
                return [
                    'title' => 'Content Management',
                    'description' => 'Managing system content, documentation, and configuration',
                    'sections' => [
                        [
                            'heading' => 'Content Types',
                            'content' => 'Different types of content managed within the system:

Documentation Content:
• User manuals and guides
• Technical documentation
• Process procedures and workflows
• Training materials and resources
• System help and tutorials

Configuration Content:
• System settings and parameters
• User interface customizations
• Report templates and formats
• Dashboard layouts and widgets
• Alert rules and thresholds

Multimedia Content:
• Images and diagrams
• Video tutorials and demonstrations
• Audio recordings and notes
• Interactive presentations
• Document attachments and files'
                        ],
                        [
                            'heading' => 'Content Editor',
                            'content' => 'Built-in content management and editing tools:

Editor Features:
• Rich text editing with formatting
• Image and media embedding
• Link management and validation
• Version control and history
• Collaborative editing capabilities

Content Organization:
• Hierarchical folder structure
• Tagging and categorization
• Search and filtering options
• Content relationships and linking
• Automated content organization

Publishing Workflow:
• Draft creation and editing
• Review and approval process
• Scheduled publishing options
• Content archiving and removal
• Access control and permissions'
                        ]
                    ]
                ];
            default:
                return $this->getDefaultContent($page);
        }
    }

    /**
     * About content including credits
     */
    private function getAboutContent($page)
    {
        switch ($page) {
            case 'credits':
                return [
                    'title' => 'Credits',
                    'description' => 'Acknowledgments and contributors',
                    'sections' => [
                        [
                            'heading' => 'Development Team',
                            'content' => 'This system was developed by the Performance Testing team with contributions from various departments.'
                        ],
                        [
                            'heading' => 'Technologies Used',
                            'content' => '• Laravel Framework• React.js• Inertia.js• Tailwind CSS• Docker• MariaDB/MySQL'
                        ],
                        [
                            'heading' => 'Special Thanks',
                            'content' => 'Special recognition to all team members who contributed to testing, feedback, and system improvements.'
                        ]
                    ]
                ];
            default:
                return $this->getDefaultContent($page);
        }
    }

    /**
     * API Reference content
     */
    private function getApiReferenceContent($page)
    {
        switch ($page) {
            case 'authentication-api':
                return [
                    'title' => 'Authentication API',
                    'description' => 'API endpoints for user authentication and session management',
                    'sections' => [
                        [
                            'heading' => 'Authentication Overview',
                            'content' => 'The Authentication API provides secure access control for the Performance Testing system:

Base URL: https://your-domain.com/api/auth
Content-Type: application/json
Rate Limiting: 60 requests per minute per IP

Authentication Methods:
• Session-based: Traditional cookie-based authentication
• Token-based: API token authentication for external integrations
• OAuth2: Third-party authentication integration
• SAML: Enterprise single sign-on support

Security Features:
• CSRF protection for web requests
• Rate limiting and brute force protection
• IP-based access restrictions
• Multi-factor authentication support
• Audit logging for all authentication events'
                        ],
                        [
                            'heading' => 'Login Endpoint',
                            'content' => 'POST /api/auth/login

Authenticate a user with username and password.

Request Headers:
  Content-Type: application/json
  X-CSRF-TOKEN: [token] (for web requests)

Request Body:
{
  "username": "string",
  "password": "string",
  "remember": boolean (optional),
  "device_name": "string" (optional for token auth)
}

Success Response (200):
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "id": "string",
    "name": "string",
    "plant_id": integer,
    "can_access_all_units": boolean
  },
  "requires_unit_selection": boolean,
  "available_units": [
    {
      "unit_id": integer,
      "unit_name": "string",
      "plant_id": integer
    }
  ],
  "token": "string" (for API authentication)
}

Error Responses:
401 - Invalid credentials
422 - Validation errors
429 - Too many attempts
500 - Server error

Example cURL:
curl -X POST https://your-domain.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d \'{"username":"user123","password":"password123"}\'
'
                        ],
                        [
                            'heading' => 'Logout Endpoint',
                            'content' => 'POST /api/auth/logout

Terminate the current user session.

Request Headers:
  Authorization: Bearer [token] (for API auth)
  X-CSRF-TOKEN: [token] (for web auth)

Request Body: None

Success Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}

Error Responses:
401 - Unauthorized
500 - Server error

Example cURL:
curl -X POST https://your-domain.com/api/auth/logout \\
  -H "Authorization: Bearer your-api-token"'
                        ],
                        [
                            'heading' => 'User Profile Endpoint',
                            'content' => 'GET /api/auth/user

Retrieve current authenticated user information.

Request Headers:
  Authorization: Bearer [token]

Success Response (200):
{
  "id": "string",
  "name": "string",
  "plant_id": integer,
  "status": integer,
  "can_access_all_units": boolean,
  "available_units": [
    {
      "unit_id": integer,
      "unit_name": "string",
      "plant_id": integer,
      "status": integer
    }
  ],
  "permissions": [
    "read",
    "write",
    "admin"
  ],
  "last_login": "2023-12-01T10:30:00Z"
}

Error Responses:
401 - Unauthorized
404 - User not found
500 - Server error'
                        ]
                    ]
                ];
            case 'performance-api':
                return [
                    'title' => 'Performance API',
                    'description' => 'API endpoints for managing performance records and data',
                    'sections' => [
                        [
                            'heading' => 'Performance Records Overview',
                            'content' => 'The Performance API manages performance monitoring records:

Base URL: https://your-domain.com/api/performance
Authentication: Bearer token required
Rate Limiting: 100 requests per minute

Available Operations:
• List performance records with filtering
• Create new performance records
• Retrieve specific record details
• Update existing records (if editable)
• Delete records (with proper permissions)
• Bulk operations for multiple records

Supported Filters:
• Date range filtering
• Status filtering (Draft/Finished)
• Type filtering (Routine, Before OH, After OH, Research)
• Unit-based filtering
• Search by description

Data Formats:
• JSON for API responses
• CSV/Excel export capabilities
• Real-time data streaming via WebSockets
• Bulk import via file upload'
                        ],
                        [
                            'heading' => 'List Performance Records',
                            'content' => 'GET /api/performance

Retrieve a paginated list of performance records.

Query Parameters:
  unit_id: integer (required)
  page: integer (default: 1)
  per_page: integer (default: 15, max: 100)
  status: string (editable|locked)
  type: string (routine|before_oh|after_oh|research)
  date_from: date (YYYY-MM-DD)
  date_to: date (YYYY-MM-DD)
  search: string (search in description)
  sort: string (date_created|date_perfomance|description)
  order: string (asc|desc, default: desc)

Success Response (200):
{
  "data": [
    {
      "perf_id": integer,
      "description": "string",
      "date_perfomance": "2023-12-01 10:30:00",
      "date_created": "2023-12-01 08:00:00",
      "status": "Draft",
      "unit_id": integer,
      "unit_name": "string",
      "type": "Routine",
      "weight": "Beban 1"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 150,
    "per_page": 15,
    "last_page": 10
  },
  "links": {
    "first": "url",
    "last": "url",
    "prev": null,
    "next": "url"
  }
}

Example cURL:
curl -H "Authorization: Bearer token" \\
  "https://your-domain.com/api/performance?unit_id=1&status=editable"'
                        ],
                        [
                            'heading' => 'Create Performance Record',
                            'content' => 'POST /api/performance

Create a new performance monitoring record.

Request Headers:
  Authorization: Bearer [token]
  Content-Type: application/json

Request Body:
{
  "description": "string (required, max: 255)",
  "date_perfomance": "YYYY-MM-DD HH:MM:SS (required)",
  "status": "Draft|Finished (required)",
  "unit_id": integer (required),
  "type": "Routine|Sebelum OH|Paska OH|Puslitbang (optional)",
  "weight": "Beban 1|Beban 2|Beban 3 (optional)"
}

Success Response (201):
{
  "success": true,
  "message": "Performance record created successfully",
  "performance": {
    "perf_id": integer,
    "description": "string",
    "date_perfomance": "2023-12-01 10:30:00",
    "date_created": "2023-12-01 08:00:00",
    "status": "Draft",
    "unit_id": integer,
    "unit_name": "string",
    "type": "Routine",
    "weight": "Beban 1"
  }
}

Error Responses:
400 - Bad request / Invalid data
401 - Unauthorized
403 - Insufficient permissions
422 - Validation errors
500 - Server error'
                        ],
                        [
                            'heading' => 'Update Performance Record',
                            'content' => 'PUT /api/performance/{id}

Update an existing performance record.

Path Parameters:
  id: integer (performance record ID)

Request Headers:
  Authorization: Bearer [token]
  Content-Type: application/json

Request Body:
{
  "description": "string (required, max: 255)",
  "date_perfomance": "YYYY-MM-DD HH:MM:SS (required)",
  "status": "Draft|Finished (required)",
  "type": "Routine|Sebelum OH|Paska OH|Puslitbang (optional)",
  "weight": "Beban 1|Beban 2|Beban 3 (optional)"
}

Success Response (200):
{
  "success": true,
  "message": "Performance record updated successfully",
  "performance": {
    "perf_id": integer,
    "description": "string",
    "date_perfomance": "2023-12-01 10:30:00",
    "date_created": "2023-12-01 08:00:00",
    "status": "Draft",
    "unit_id": integer,
    "unit_name": "string",
    "type": "Routine",
    "weight": "Beban 1"
  }
}

Error Responses:
400 - Bad request
401 - Unauthorized
403 - Record is locked or insufficient permissions
404 - Record not found
422 - Validation errors
500 - Server error'
                        ]
                    ]
                ];
            case 'data-analysis-api':
                return [
                    'title' => 'Data Analysis API',
                    'description' => 'API endpoints for data analysis, statistics, and reporting',
                    'sections' => [
                        [
                            'heading' => 'Analysis Endpoints Overview',
                            'content' => 'The Data Analysis API provides comprehensive analytical capabilities:

Base URL: https://your-domain.com/api/analysis
Authentication: Bearer token required
Rate Limiting: 200 requests per minute

Available Analysis Types:
• Statistical analysis and calculations
• Trend analysis and forecasting
• Comparative analysis between periods
• Real-time data streaming
• Custom report generation
• Data export in multiple formats

Data Processing Features:
• Large dataset handling with pagination
• Asynchronous processing for complex analyses
• Caching for frequently requested data
• Real-time updates via WebSocket connections
• Batch processing for bulk operations

Supported Data Formats:
• JSON for API responses
• CSV for tabular data export
• Excel for complex reports
• PDF for formatted reports
• SVG/PNG for chart exports'
                        ],
                        [
                            'heading' => 'Statistical Analysis',
                            'content' => 'POST /api/analysis/statistics

Perform statistical analysis on performance data.

Request Headers:
  Authorization: Bearer [token]
  Content-Type: application/json

Request Body:
{
  "unit_id": integer (required),
  "performance_ids": [integer] (optional, specific records),
  "date_from": "YYYY-MM-DD" (required),
  "date_to": "YYYY-MM-DD" (required),
  "parameters": ["param1", "param2"] (required),
  "analysis_types": [
    "basic_stats",
    "regression",
    "correlation",
    "trend_analysis"
  ]
}

Success Response (200):
{
  "success": true,
  "analysis_id": "uuid",
  "results": {
    "basic_stats": {
      "param1": {
        "count": 100,
        "mean": 75.5,
        "median": 76.0,
        "std_dev": 5.2,
        "min": 65.0,
        "max": 85.0,
        "percentiles": {
          "25": 72.0,
          "75": 79.0,
          "95": 83.0
        }
      }
    },
    "correlation": {
      "param1_param2": 0.85
    },
    "trend_analysis": {
      "param1": {
        "trend": "increasing",
        "slope": 0.12,
        "r_squared": 0.78
      }
    }
  },
  "metadata": {
    "data_points": 100,
    "date_range": "2023-01-01 to 2023-12-31",
    "processing_time_ms": 1250
  }
}'
                        ],
                        [
                            'heading' => 'Chart Data Generation',
                            'content' => 'GET /api/analysis/chart-data

Generate chart data for visualization.

Query Parameters:
  unit_id: integer (required)
  chart_type: string (line|bar|scatter|heatmap)
  parameters: string (comma-separated parameter names)
  date_from: date (YYYY-MM-DD)
  date_to: date (YYYY-MM-DD)
  resolution: string (hour|day|week|month)
  aggregation: string (avg|sum|min|max|count)

Success Response (200):
{
  "chart_type": "line",
  "data": {
    "labels": [
      "2023-01-01",
      "2023-01-02",
      "2023-01-03"
    ],
    "datasets": [
      {
        "label": "Parameter 1",
        "data": [75.5, 76.2, 74.8],
        "borderColor": "#ff6384",
        "backgroundColor": "#ff638450"
      }
    ]
  },
  "options": {
    "responsive": true,
    "scales": {
      "x": {
        "type": "time",
        "time": {
          "unit": "day"
        }
      },
      "y": {
        "beginAtZero": false
      }
    }
  },
  "metadata": {
    "total_points": 90,
    "date_range": "2023-01-01 to 2023-03-31"
  }
}'
                        ]
                    ]
                ];
            case 'units-api':
                return [
                    'title' => 'Units API',
                    'description' => 'API endpoints for managing operational units and access',
                    'sections' => [
                        [
                            'heading' => 'Units Management Overview',
                            'content' => 'The Units API manages operational units and user access:

Base URL: https://your-domain.com/api/units
Authentication: Bearer token required
Rate Limiting: 100 requests per minute

Unit Operations:
• List available units for current user
• Retrieve detailed unit information
• Select active unit for session
• Manage unit access permissions
• Unit configuration and settings

Access Control:
• Plant-based access restrictions
• Role-based unit permissions
• Temporary access grants
• Multi-unit access management
• Admin override capabilities

Unit Properties:
• Unique identification and naming
• Operational status and configuration
• Associated equipment and systems
• Performance monitoring settings
• User access permissions and history'
                        ],
                        [
                            'heading' => 'List Available Units',
                            'content' => 'GET /api/units

Retrieve units available to the current user.

Query Parameters:
  include_inactive: boolean (default: false)
  plant_id: integer (filter by plant)

Success Response (200):
{
  "success": true,
  "units": [
    {
      "unit_id": integer,
      "unit_name": "string",
      "plant_id": integer,
      "status": integer,
      "tab_manual_aktif": integer,
      "description": "string",
      "last_accessed": "2023-12-01T10:30:00Z",
      "equipment_count": integer,
      "active_records": integer,
      "permissions": [
        "read",
        "write"
      ]
    }
  ],
  "metadata": {
    "total_units": integer,
    "user_can_access_all": boolean,
    "default_unit": integer
  }
}

Error Responses:
401 - Unauthorized
403 - No units accessible
500 - Server error'
                        ],
                        [
                            'heading' => 'Select Active Unit',
                            'content' => 'POST /api/units/select

Set the active unit for the current session.

Request Headers:
  Authorization: Bearer [token]
  Content-Type: application/json

Request Body:
{
  "unit_id": integer (required)
}

Success Response (200):
{
  "success": true,
  "message": "Unit selected successfully",
  "selected_unit": {
    "unit_id": integer,
    "unit_name": "string",
    "plant_id": integer,
    "tab_manual_aktif": integer,
    "permissions": [
      "read",
      "write"
    ],
    "dashboard_config": {
      "default_charts": [...],
      "custom_widgets": [...]
    }
  }
}

Error Responses:
400 - Invalid unit ID
401 - Unauthorized
403 - Access denied to unit
404 - Unit not found
500 - Server error'
                        ]
                    ]
                ];
            default:
                return $this->getDefaultContent($page);
        }
    }

    private function getDeploymentContent($page)
    {
        switch ($page) {
            case 'docker-setup':
                return [
                    'title' => 'Docker Setup',
                    'description' => 'Complete guide to setting up the application using Docker containers',
                    'sections' => [
                        [
                            'heading' => 'Docker Architecture',
                            'content' => 'The Performance Testing system uses a containerized architecture:

Container Structure:
• performance-testing-app: Main application container (PHP 8.2 + Apache)
• database: MySQL/MariaDB database container
• redis: Redis cache container (optional)
• nginx: Load balancer/proxy (production only)

Network Configuration:
• Internal docker network for container communication
• External port mapping for web access
• Database access restricted to application containers
• Redis access limited to application containers

Volume Management:
• Application code: Bind mount for development
• Database data: Named volume for persistence
• Logs: Named volume for centralized logging
• Uploads: Named volume for file storage

Resource Allocation:
• App container: 2GB RAM, 2 CPU cores
• Database: 4GB RAM, 2 CPU cores
• Redis: 512MB RAM, 1 CPU core
• Total minimum: 6.5GB RAM, 4 CPU cores'
                        ],
                        [
                            'heading' => 'Docker Compose Configuration',
                            'content' => 'The docker-compose.yml file defines the complete stack:

Services Configuration:
• App service uses webdevops/php-apache:8.2 image
• Automatic PHP and Apache configuration
• Environment variables for database connection
• Volume mounts for application files
• Port mapping (8000:80) for web access

Environment Variables:
• WEB_DOCUMENT_ROOT=/app/public
• PHP_DISPLAY_ERRORS=1 (development)
• PHP_MEMORY_LIMIT=512M
• PHP_MAX_EXECUTION_TIME=300
• Database connection variables

Network Settings:
• Bridge network mode for container communication
• Host gateway access for external database connections
• DNS resolution between containers
• Port exposure for external access

Development vs Production:
• Development: Direct code mounting, debug enabled
• Production: Optimized images, security hardened
• Staging: Hybrid configuration for testing
• Testing: Isolated environment with test data'
                        ],
                        [
                            'heading' => 'Container Deployment',
                            'content' => 'Step-by-step container deployment process:

Preparation Steps:
1. Ensure Docker and Docker Compose are installed
2. Clone the repository to your deployment location
3. Copy .env.example to .env and configure
4. Verify port availability (8000, 3306, 6379)
5. Check system resources and disk space

Deployment Commands:
  # Build and start containers
  docker-compose up -d
  
  # Install PHP dependencies
  docker-compose exec app composer install --no-dev --optimize-autoloader
  
  # Install Node dependencies and build assets
  docker-compose exec app npm install
  docker-compose exec app npm run build
  
  # Run database migrations
  docker-compose exec app php artisan migrate
  
  # Set proper permissions
  docker-compose exec app chown -R application:application /app
  docker-compose exec app chmod -R 755 /app/storage

Container Management:
• Start: docker-compose up -d
• Stop: docker-compose down
• Restart: docker-compose restart
• Logs: docker-compose logs -f
• Shell access: docker-compose exec app bash

Health Monitoring:
• Container status: docker-compose ps
• Resource usage: docker stats
• Log monitoring: docker-compose logs -f app
• Database connectivity: docker-compose exec app php artisan tinker'
                        ]
                    ]
                ];
            case 'environment-configuration':
                return [
                    'title' => 'Environment Configuration',
                    'description' => 'Detailed guide to configuring environment variables and application settings',
                    'sections' => [
                        [
                            'heading' => 'Environment File Structure',
                            'content' => 'The .env file contains all configuration variables:

Application Settings:
• APP_NAME: Application name for display
• APP_ENV: Environment (local, staging, production)
• APP_KEY: Encryption key (generate with php artisan key:generate)
• APP_DEBUG: Debug mode (true for development, false for production)
• APP_URL: Base URL of the application

Database Configuration:
• DB_CONNECTION: Database driver (mysql)
• DB_PT_HOST: Primary database host
• DB_PT_PORT: Database port (default: 3306)
• DB_PT_DATABASE: Database name
• DB_PT_USERNAME: Database username
• DB_PT_PASSWORD: Database password

Multi-Database Setup:
• DB_SOKET_*: Socket database configuration
• DB_PACITAN_*: Pacitan database configuration
• Each database has separate connection parameters
• Fallback connections for high availability

Cache and Session:
• CACHE_DRIVER: Cache system (redis, file, database)
• SESSION_DRIVER: Session storage (redis, file, database)
• REDIS_HOST: Redis server host
• REDIS_PASSWORD: Redis authentication
• REDIS_PORT: Redis port (default: 6379)'
                        ],
                        [
                            'heading' => 'Security Configuration',
                            'content' => 'Essential security settings for production deployment:

Authentication Settings:
• SESSION_LIFETIME: Session duration in minutes
• SESSION_ENCRYPT: Enable session encryption
• SESSION_HTTP_ONLY: Prevent JavaScript access to sessions
• SESSION_SAME_SITE: CSRF protection level

HTTPS Configuration:
• ASSET_URL: CDN or secure asset URL
• FORCE_HTTPS: Force HTTPS redirects
• HSTS_ENABLED: HTTP Strict Transport Security
• SSL_VERIFY: Verify SSL certificates

API Security:
• API_RATE_LIMIT: Requests per minute limit
• CORS_ALLOWED_ORIGINS: Allowed cross-origin domains
• CSRF_TOKEN_EXPIRY: CSRF token lifetime
• JWT_SECRET: API token encryption key (if using JWT)

File Security:
• UPLOAD_MAX_SIZE: Maximum file upload size
• ALLOWED_FILE_TYPES: Permitted file extensions
• SCAN_UPLOADS: Enable virus scanning
• STORAGE_ENCRYPTION: Encrypt stored files

Database Security:
• DB_ENCRYPT: Enable database connection encryption
• DB_SSL_MODE: SSL connection mode
• DB_SSL_CERT: SSL certificate path
• BACKUP_ENCRYPTION: Encrypt database backups'
                        ],
                        [
                            'heading' => 'Performance Optimization',
                            'content' => 'Configuration settings for optimal performance:

PHP Optimization:
• PHP_MEMORY_LIMIT: 512M (minimum), 1024M (recommended)
• PHP_MAX_EXECUTION_TIME: 300 (for heavy operations)
• PHP_MAX_INPUT_VARS: 5000 (for large forms)
• OPCACHE_ENABLE: true (enable OPcache)
• OPCACHE_MEMORY: 256M (OPcache memory allocation)

Database Optimization:
• DB_POOL_SIZE: Connection pool size
• DB_TIMEOUT: Query timeout in seconds
• DB_CHARSET: utf8mb4 (full Unicode support)
• DB_COLLATION: utf8mb4_unicode_ci
• QUERY_CACHE: Enable query result caching

Caching Configuration:
• CACHE_TTL: Default cache lifetime in seconds
• VIEW_CACHE: Enable view compilation caching
• ROUTE_CACHE: Enable route caching
• CONFIG_CACHE: Enable configuration caching
• EVENT_CACHE: Enable event listener caching

Asset Optimization:
• ASSET_VERSION: Cache busting version
• CDN_URL: Content delivery network URL
• COMPRESS_ASSETS: Enable asset compression
• LAZY_LOADING: Enable image lazy loading
• WEBP_SUPPORT: Enable WebP image format'
                        ]
                    ]
                ];
            case 'database-setup':
                return [
                    'title' => 'Database Setup',
                    'description' => 'Complete database configuration, migration, and maintenance guide',
                    'sections' => [
                        [
                            'heading' => 'Database Architecture',
                            'content' => 'The system uses a multi-database architecture:

Primary Databases:
• pt: Main performance testing database
• db_soket: Socket communication data
• db_pacitan_1: Plant-specific operational data

Database Schema Overview:
• tb_user: User accounts and authentication
• tb_unit: Operational units and plant hierarchy
• tb_performance: Performance monitoring records
• tb_input: Input data and measurements
• tb_input_tag: Tag-based data organization

Connection Management:
• Laravel database connections for each database
• Connection pooling for high availability
• Automatic failover between database servers
• Read/write splitting for performance
• Transaction management across databases

Indexing Strategy:
• Primary keys: Auto-incrementing integers
• Foreign keys: Proper referential integrity
• Search indexes: On frequently queried columns
• Composite indexes: For complex queries
• Unique constraints: Data integrity enforcement'
                        ],
                        [
                            'heading' => 'Database Migration',
                            'content' => 'Step-by-step database setup and migration process:

Initial Setup:
1. Create databases on your MySQL/MariaDB server:
   CREATE DATABASE pt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE DATABASE db_soket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE DATABASE db_pacitan_1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

2. Create database user with appropriate permissions:
   CREATE USER \'pt_user\'@\'%\' IDENTIFIED BY \'secure_password\';
   GRANT ALL PRIVILEGES ON pt.* TO \'pt_user\'@\'%\';
   GRANT SELECT, INSERT, UPDATE ON db_soket.* TO \'pt_user\'@\'%\';
   GRANT SELECT, INSERT, UPDATE ON db_pacitan_1.* TO \'pt_user\'@\'%\';

Migration Commands:
  # Run all pending migrations
  php artisan migrate
  
  # Run migrations for specific connection
  php artisan migrate --database=mysql
  
  # Check migration status
  php artisan migrate:status
  
  # Rollback migrations (if needed)
  php artisan migrate:rollback
  
  # Fresh migration (development only)
  php artisan migrate:fresh --seed

Seeding Data:
  # Run all seeders
  php artisan db:seed
  
  # Run specific seeder
  php artisan db:seed --class=UserSeeder
  
  # Create admin user
  php artisan make:admin-user

Data Validation:
• Verify table creation and structure
• Check foreign key relationships
• Validate initial data seeding
• Test database connections
• Confirm index creation'
                        ],
                        [
                            'heading' => 'Database Maintenance',
                            'content' => 'Ongoing database maintenance and optimization:

Regular Maintenance Tasks:
• Daily: Monitor performance and slow queries
• Weekly: Update table statistics and optimize
• Monthly: Check database integrity and cleanup
• Quarterly: Review and update indexes
• Annually: Plan for capacity and upgrades

Performance Monitoring:
  # Check database size and growth
  SELECT table_schema, 
         ROUND(SUM(data_length + index_length) / 1024 / 1024, 1) AS \'DB Size in MB\'
  FROM information_schema.tables 
  GROUP BY table_schema;
  
  # Identify slow queries
  SELECT query_time, lock_time, rows_sent, rows_examined, sql_text
  FROM mysql.slow_log
  ORDER BY query_time DESC LIMIT 10;
  
  # Monitor table sizes
  SELECT table_name, 
         ROUND(((data_length + index_length) / 1024 / 1024), 2) AS \'Size in MB\'
  FROM information_schema.tables 
  WHERE table_schema = \'pt\'
  ORDER BY (data_length + index_length) DESC;

Backup Strategy:
• Automated daily backups with retention policy
• Full backup weekly, incremental daily
• Point-in-time recovery capabilities
• Backup integrity verification
• Disaster recovery testing

Optimization Commands:
  # Optimize tables
  php artisan db:optimize-tables
  
  # Update table statistics
  ANALYZE TABLE tb_performance, tb_input, tb_user;
  
  # Check table integrity
  CHECK TABLE tb_performance EXTENDED;
  
  # Repair tables if needed
  REPAIR TABLE tb_performance;'
                        ]
                    ]
                ];
            case 'production-deployment':
                return [
                    'title' => 'Production Deployment',
                    'description' => 'Comprehensive guide for deploying to production environment',
                    'sections' => [
                        [
                            'heading' => 'Production Prerequisites',
                            'content' => 'Essential requirements for production deployment:

Server Requirements:
• Operating System: Ubuntu 20.04 LTS or CentOS 8+
• CPU: 4+ cores (8+ recommended for high load)
• RAM: 8GB minimum (16GB+ recommended)
• Storage: 100GB+ SSD with backup storage
• Network: 1Gbps connection with static IP

Security Requirements:
• Firewall configuration (UFW or iptables)
• SSL certificate from trusted CA
• Regular security updates schedule
• Intrusion detection system
• Log monitoring and alerting

Infrastructure Components:
• Load balancer (HAProxy or Nginx)
• Database server (MySQL 8.0+ cluster)
• Cache server (Redis cluster)
• File storage (NFS or object storage)
• Monitoring system (Prometheus/Grafana)

Network Configuration:
• Domain name with proper DNS configuration
• SSL/TLS certificates (Let\'s Encrypt or commercial)
• CDN setup for static assets
• Backup network connectivity
• VPN access for administration'
                        ],
                        [
                            'heading' => 'Production Deployment Process',
                            'content' => 'Step-by-step production deployment procedure:

Pre-deployment Checklist:
□ Code review and testing completed
□ Database migrations tested
□ Environment configuration verified
□ SSL certificates installed
□ Backup systems operational
□ Monitoring systems configured

Deployment Steps:
1. Prepare the production server:
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker and Docker Compose
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose

2. Deploy application code:
   # Clone repository
   git clone https://github.com/your-org/performance-testing.git
   cd performance-testing
   
   # Switch to production branch
   git checkout production
   
   # Copy production environment file
   cp .env.production .env

3. Configure production environment:
   # Edit environment variables
   nano .env
   
   # Set production values:
   APP_ENV=production
   APP_DEBUG=false
   DB_HOST=your-production-db-host
   CACHE_DRIVER=redis
   SESSION_DRIVER=redis
   QUEUE_DRIVER=redis

4. Start production services:
   # Build and start containers
   docker-compose -f docker-compose.prod.yml up -d
   
   # Install dependencies
   docker-compose exec app composer install --no-dev --optimize-autoloader
   
   # Build production assets
   docker-compose exec app npm ci
   docker-compose exec app npm run production
   
   # Run migrations
   docker-compose exec app php artisan migrate --force
   
   # Cache configuration
   docker-compose exec app php artisan config:cache
   docker-compose exec app php artisan route:cache
   docker-compose exec app php artisan view:cache

Post-deployment Verification:
• Application accessibility test
• Database connectivity verification
• SSL certificate validation
• Performance baseline measurement
• Monitoring system activation'
                        ],
                        [
                            'heading' => 'Production Monitoring',
                            'content' => 'Comprehensive monitoring setup for production environment:

Application Monitoring:
• Health check endpoints for load balancer
• Application performance monitoring (APM)
• Error tracking and alerting
• User experience monitoring
• API endpoint monitoring

System Monitoring:
• Server resource utilization (CPU, RAM, disk)
• Network performance and connectivity
• Container health and resource usage
• Database performance metrics
• Cache hit rates and memory usage

Log Management:
• Centralized log aggregation (ELK stack)
• Log rotation and retention policies
• Error log alerting and notification
• Security event logging
• Audit trail maintenance

Alerting Configuration:
• Critical alerts: Database down, application errors
• Warning alerts: High resource usage, slow responses
• Info alerts: Deployment notifications, maintenance
• Escalation procedures for unacknowledged alerts
• Alert fatigue prevention strategies

Performance Metrics:
• Response time percentiles (p50, p95, p99)
• Throughput (requests per second)
• Error rates and availability
• Database query performance
• Cache efficiency metrics

Backup and Recovery:
• Automated daily database backups
• Application code and configuration backups
• Disaster recovery procedures
• Recovery time and point objectives
• Regular recovery testing schedule'
                        ]
                    ]
                ];
            default:
                return $this->getDefaultContent($page);
        }
    }

    private function getTroubleshootingContent($page)
    {
        switch ($page) {
            case 'common-issues':
                return [
                    'title' => 'Common Issues',
                    'description' => 'Solutions to frequently encountered problems and troubleshooting steps',
                    'sections' => [
                        [
                            'heading' => 'Login and Authentication Issues',
                            'content' => 'Common authentication problems and their solutions:

**Problem: Cannot login with correct credentials**
• Clear browser cache and cookies
• Check if Caps Lock is enabled
• Verify username format (some systems use email vs username)
• Try accessing from a different browser or incognito mode
• Contact administrator to verify account status

**Problem: Session expires too quickly**
• Check if "Remember Me" option is available and enabled
• Verify browser settings allow cookies
• Ensure stable internet connection
• Contact administrator to review session timeout settings

**Problem: "Access Denied" after login**
• Verify user account has been assigned to appropriate units
• Check if account has necessary permissions
• Confirm account is active and not suspended
• Contact administrator to review user role assignments

**Problem: Two-factor authentication not working**
• Ensure device time is synchronized
• Regenerate authentication codes if using app
• Check if backup codes are available
• Contact administrator for 2FA reset if needed

**Problem: Password reset not working**
• Check spam/junk folder for reset email
• Verify email address is correct in system
• Ensure reset link hasn\'t expired (typically 1 hour)
• Try requesting new reset link after 15 minutes'
                        ],
                        [
                            'heading' => 'Data Loading and Display Issues',
                            'content' => 'Troubleshooting data-related problems:

**Problem: Data not loading or displaying**
• Refresh the page (F5 or Ctrl+R)
• Check internet connection stability
• Clear browser cache and reload
• Try switching to a different unit and back
• Verify date range selections are valid

**Problem: Charts not displaying correctly**
• Ensure browser supports modern JavaScript
• Disable browser extensions temporarily
• Check if data exists for selected time period
• Try a different chart type or parameter
• Clear browser data and reload application

**Problem: Performance records not appearing**
• Verify correct unit is selected
• Check if user has read permissions for the unit
• Confirm records exist for selected date range
• Try broader date range or different filters
• Contact administrator if records should exist

**Problem: Export functions not working**
• Check if popup blocker is disabled
• Ensure browser allows file downloads
• Verify sufficient data exists for export
• Try smaller date ranges for large exports
• Check available disk space on local machine

**Problem: Real-time data not updating**
• Check network connection stability
• Verify WebSocket connections are allowed
• Disable VPN or proxy temporarily
• Try refreshing the page
• Contact administrator if system-wide issue'
                        ],
                        [
                            'heading' => 'Performance and Speed Issues',
                            'content' => 'Resolving system performance problems:

**Problem: Application loads slowly**
• Check internet connection speed
• Clear browser cache and cookies
• Disable unnecessary browser extensions
• Close other applications consuming bandwidth
• Try accessing during off-peak hours

**Problem: Charts and graphs load slowly**
• Reduce date range for complex analyses
• Select fewer parameters for visualization
• Use aggregated data instead of raw data
• Clear browser cache and reload
• Try a different browser or device

**Problem: Database operations timeout**
• Reduce complexity of queries/filters
• Use smaller date ranges for data analysis
• Avoid running multiple heavy operations simultaneously
• Contact administrator if timeouts persist
• Check system maintenance schedules

**Problem: File uploads fail or timeout**
• Check file size limits (typically 10MB max)
• Verify file format is supported
• Ensure stable internet connection
• Try uploading smaller files first
• Use wired connection instead of WiFi

**Problem: Browser becomes unresponsive**
• Close and restart browser
• Clear browser cache and data
• Disable hardware acceleration in browser
• Try different browser (Chrome, Firefox, Edge)
• Restart computer if issues persist'
                        ]
                    ]
                ];
            case 'error-codes':
                return [
                    'title' => 'Error Codes',
                    'description' => 'Comprehensive list of system error codes and their meanings',
                    'sections' => [
                        [
                            'heading' => 'Authentication Error Codes',
                            'content' => 'Error codes related to login and authentication:

**AUTH-001: Invalid Credentials**
• Meaning: Username or password is incorrect
• Solution: Verify credentials, check caps lock, use password reset
• Common causes: Typos, changed password, disabled account

**AUTH-002: Account Finished**
• Meaning: Account temporarily locked due to failed login attempts
• Solution: Wait 15-30 minutes or contact administrator
• Prevention: Avoid repeated failed login attempts

**AUTH-003: Session Expired**
• Meaning: User session has timed out
• Solution: Login again, enable "Remember Me" option
• Common causes: Inactivity timeout, server restart

**AUTH-004: Insufficient Permissions**
• Meaning: User lacks required permissions for requested action
• Solution: Contact administrator to review access rights
• Common causes: Role changes, unit access restrictions

**AUTH-005: Multi-factor Authentication Required**
• Meaning: 2FA verification needed to complete login
• Solution: Enter code from authenticator app or SMS
• Troubleshooting: Check device time sync, regenerate codes

**AUTH-006: Password Expired**
• Meaning: User password has exceeded expiration policy
• Solution: Change password through user settings
• Prevention: Change password before expiration date'
                        ],
                        [
                            'heading' => 'Data Processing Error Codes',
                            'content' => 'Error codes for data operations and processing:

**DATA-001: Database Connection Failed**
• Meaning: Cannot establish connection to database
• Solution: Check network, contact administrator
• Impact: All data operations unavailable

**DATA-002: Query Timeout**
• Meaning: Database query exceeded time limit
• Solution: Reduce date range, simplify filters
• Prevention: Use appropriate date ranges for analysis

**DATA-003: Data Validation Failed**
• Meaning: Input data doesn\'t meet validation requirements
• Solution: Check data format, ranges, and required fields
• Common causes: Invalid dates, out-of-range values

**DATA-004: Insufficient Data**
• Meaning: Not enough data points for requested operation
• Solution: Expand date range or check data availability
• Common causes: Recent date ranges, missing sensors

**DATA-005: Data Export Failed**
• Meaning: Error occurred during data export process
• Solution: Try smaller datasets, check file permissions
• Troubleshooting: Verify disk space, try different format

**DATA-006: Import Validation Error**
• Meaning: Uploaded file contains invalid data
• Solution: Check file format, data types, required columns
• Prevention: Use provided templates for data import

**DATA-007: Duplicate Record**
• Meaning: Attempting to create record that already exists
• Solution: Check existing records, modify unique identifiers
• Common causes: Re-submitting forms, timing issues'
                        ],
                        [
                            'heading' => 'System Error Codes',
                            'content' => 'General system and application error codes:

**SYS-001: Internal Server Error**
• Meaning: Unexpected server-side error occurred
• Solution: Refresh page, contact administrator if persistent
• Actions: Retry operation, check system status

**SYS-002: Service Unavailable**
• Meaning: System temporarily unavailable for maintenance
• Solution: Wait and retry, check maintenance schedule
• Common causes: Scheduled maintenance, system upgrades

**SYS-003: Rate Limit Exceeded**
• Meaning: Too many requests in short time period
• Solution: Wait before retrying, reduce request frequency
• Prevention: Avoid rapid clicking, use reasonable intervals

**SYS-004: File Size Exceeded**
• Meaning: Uploaded file exceeds maximum size limit
• Solution: Compress file or split into smaller parts
• Limits: Typically 10MB for general uploads

**SYS-005: Network Timeout**
• Meaning: Network connection lost during operation
• Solution: Check internet connection, retry operation
• Prevention: Use stable network connection

**SYS-006: Resource Not Found**
• Meaning: Requested resource no longer exists
• Solution: Verify URLs, check if resource was deleted
• Common causes: Broken links, deleted records

**SYS-007: Configuration Error**
• Meaning: System configuration issue detected
• Solution: Contact administrator immediately
• Impact: May affect multiple users or features'
                        ]
                    ]
                ];
            case 'logs-debugging':
                return [
                    'title' => 'Logs & Debugging',
                    'description' => 'Guide to system logs, debugging procedures, and diagnostic tools',
                    'sections' => [
                        [
                            'heading' => 'Understanding System Logs',
                            'content' => 'Overview of logging system and log types:

**Application Logs**
• Location: /app/storage/logs/laravel.log
• Content: Application errors, warnings, and debug information
• Format: [timestamp] level.context: message
• Rotation: Daily rotation with 30-day retention

**Web Server Logs**
• Access logs: HTTP requests and responses
• Error logs: Server-level errors and issues
• Location: /var/log/apache2/ (in container)
• Format: Common Log Format (CLF) or Extended

**Database Logs**
• Query logs: All database queries and their performance
• Error logs: Database connection and query errors
• Slow query log: Queries exceeding performance thresholds
• Location: Database server logs directory

**Authentication Logs**
• Login attempts: Successful and failed authentication
• Session management: Session creation and destruction
• Security events: Suspicious activities and lockouts
• Audit trail: User actions and permission changes

**Performance Logs**
• Response times: API and page load performance
• Resource usage: Memory, CPU, and disk utilization
• Cache performance: Hit rates and miss statistics
• External API calls: Third-party service interactions'
                        ],
                        [
                            'heading' => 'Debugging Procedures',
                            'content' => 'Step-by-step debugging methodology:

**Initial Problem Assessment**
1. Identify symptoms and error messages
2. Determine scope (single user vs system-wide)
3. Check recent changes or deployments
4. Verify basic connectivity and access
5. Review recent system alerts or notifications

**Log Analysis Process**
1. Access application logs:
   docker-compose exec app tail -f storage/logs/laravel.log

2. Filter by timestamp and severity:
   grep "ERROR" storage/logs/laravel.log | tail -50

3. Search for specific errors:
   grep -A 5 -B 5 "error_message" storage/logs/laravel.log

4. Monitor real-time logs:
   docker-compose logs -f app

**Database Debugging**
1. Check database connectivity:
   docker-compose exec app php artisan tinker
   >>> DB::connection()->getPdo();

2. Monitor slow queries:
   SET GLOBAL slow_query_log = ON;
   SET GLOBAL long_query_time = 2;

3. Analyze query performance:
   EXPLAIN SELECT * FROM tb_performance WHERE unit_id = 1;

**Network and API Debugging**
1. Test API endpoints:
   curl -H "Authorization: Bearer token" https://domain/api/health

2. Check external API connectivity:
   curl -v http://10.7.146.114/pt/get-data/get-dcs2.php

3. Monitor network latency:
   ping database-server
   traceroute external-api-host

**Performance Debugging**
1. Enable query logging temporarily
2. Use browser developer tools for frontend issues
3. Monitor resource usage with docker stats
4. Profile slow operations with Xdebug (development)
5. Analyze memory usage and garbage collection'
                        ],
                        [
                            'heading' => 'Diagnostic Tools',
                            'content' => 'Available tools and commands for system diagnosis:

**Built-in Laravel Commands**
# Check application status
php artisan about

# Test database connections
php artisan db:monitor

# Clear various caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Queue monitoring
php artisan queue:work --verbose
php artisan queue:failed

# Maintenance mode
php artisan down --message="System maintenance"
php artisan up

**Docker Diagnostic Commands**
# Container status and resource usage
docker-compose ps
docker stats performance-testing-app

# Container logs
docker-compose logs -f app
docker-compose logs --tail=100 app

# Container shell access
docker-compose exec app bash
docker-compose exec app php artisan tinker

# Network connectivity between containers
docker-compose exec app ping database
docker-compose exec app telnet database 3306

**Database Diagnostic Queries**
-- Check connection status
SHOW PROCESSLIST;

-- Monitor performance
SHOW ENGINE INNODB STATUS;

-- Check table sizes
SELECT table_name, 
       ROUND(((data_length + index_length) / 1024 / 1024), 2) AS "Size in MB"
FROM information_schema.tables 
WHERE table_schema = "pt";

-- Find locked tables
SHOW OPEN TABLES WHERE In_use > 0;

**Browser-based Debugging**
• Developer Tools (F12): Network, Console, Performance tabs
• React Developer Tools: Component inspection and profiling
• Network throttling: Simulate slow connections
• JavaScript console: Error messages and debugging
• Performance profiling: Identify slow operations

**External Monitoring Tools**
• Health check endpoints: /api/health, /api/status
• Uptime monitoring: Third-party service monitoring
• Performance monitoring: APM tools integration
• Log aggregation: ELK stack or similar solutions
• Alert systems: Integration with notification services'
                        ]
                    ]
                ];
            case 'faq':
                return [
                    'title' => 'Frequently Asked Questions',
                    'description' => 'Answers to commonly asked questions about the Performance Testing System',
                    'sections' => [
                        [
                            'heading' => 'General Usage Questions',
                            'content' => '**Q: How do I access the Performance Testing System?**
A: Navigate to your organization\'s Performance Testing URL, click "Login", and enter your credentials. After successful login, select your operational unit to access the main dashboard.

**Q: What browsers are supported?**
A: The system supports Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. Chrome is recommended for the best experience. Ensure JavaScript and cookies are enabled.

**Q: Can I access the system from mobile devices?**
A: Yes, the system is responsive and works on tablets and mobile phones. However, some features like detailed charts work better on larger screens.

**Q: How often is data updated in the system?**
A: Real-time data updates every few seconds, while historical data analysis depends on the data source. Performance records are updated immediately when saved.

**Q: Can I use the system offline?**
A: No, the system requires an active internet connection to function. All data processing and storage occurs on the server.

**Q: What should I do if I forgot my password?**
A: Click "Forgot Password" on the login page, enter your username/email, and follow the instructions sent to your registered email address.

**Q: How do I switch between different units?**
A: Use the unit selector dropdown in the main navigation bar. You can switch between units without logging out, provided you have access to multiple units.'
                        ],
                        [
                            'heading' => 'Performance Records and Data',
                            'content' => '**Q: What\'s the difference between record types (Routine, Before OH, etc.)?**
A: 
• Routine: Regular scheduled monitoring and performance tracking
• Before OH (Overhaul): Baseline measurements before maintenance
• After OH: Post-maintenance verification and comparison
• Research: Special studies and investigative analysis

**Q: Why can\'t I edit a performance record?**
A: Records with "Finished" status cannot be edited to maintain data integrity. Only records with "Draft" status can be modified. Contact your supervisor or administrator if you need to modify a locked record.

**Q: How far back can I view historical data?**
A: Historical data availability depends on your organization\'s data retention policy. Typically, data is available for 2-5 years. Older data may be archived and require special access.

**Q: What\'s the maximum file size for uploads?**
A: The system typically supports files up to 10MB. For larger files, contact your administrator or split the data into smaller files.

**Q: Can I export data to Excel or other formats?**
A: Yes, most data views include export options for Excel (.xlsx), CSV, and PDF formats. Use the export button in the respective sections.

**Q: Why are some charts not displaying data?**
A: Common reasons include: no data for selected time period, insufficient permissions, network connectivity issues, or browser compatibility problems.'
                        ],
                        [
                            'heading' => 'Permissions and Access',
                            'content' => '**Q: Why do I see "Access Denied" for certain features?**
A: Your user role determines which features you can access. Contact your administrator to review your permissions if you need access to restricted features.

**Q: How do I request access to additional units?**
A: Contact your system administrator or supervisor with a request specifying which units you need access to and the business justification.

**Q: Can I have different permission levels for different units?**
A: Yes, the system supports unit-specific permissions. You might have read-only access to some units and full access to others.

**Q: How long do user sessions last?**
A: Standard sessions last 8 hours of activity or timeout after 30 minutes of inactivity. You can extend sessions with the "Remember Me" option during login.

**Q: What happens if my account is locked?**
A: Account lockouts typically occur after 5 failed login attempts. Wait 15-30 minutes for automatic unlock, or contact your administrator for immediate assistance.

**Q: Can I change my password myself?**
A: Yes, go to User Settings (usually accessible from your profile menu) to change your password. New passwords must meet security requirements.

**Q: Who can see my performance records?**
A: Access to performance records depends on organizational hierarchy and permissions. Typically, supervisors and administrators can view records from their respective units.'
                        ],
                        [
                            'heading' => 'Technical and Troubleshooting',
                            'content' => '**Q: What should I do if the system is running slowly?**
A: Try: clearing browser cache, closing unnecessary browser tabs, using a wired internet connection, accessing during off-peak hours, or contacting IT support for network issues.

**Q: Why do I get "Session Expired" messages frequently?**
A: This can happen due to: network instability, browser settings blocking cookies, or working with multiple browser tabs. Try using a single tab and ensure cookies are enabled.

**Q: Can I work with multiple browser tabs open?**
A: Yes, but session management works best with a single tab. Multiple tabs might cause session conflicts or performance issues.

**Q: What do I do if I encounter an error message?**
A: Note the exact error message and steps that led to it. Try refreshing the page first. If the error persists, contact your administrator with the error details.

**Q: Is my data automatically saved?**
A: Draft data is typically auto-saved every few minutes, but you should manually save important work using the Save button. Don\'t rely solely on auto-save.

**Q: What browsers extensions might cause issues?**
A: Ad blockers, privacy extensions, and script blockers can interfere with functionality. Try disabling extensions temporarily if you encounter issues.

**Q: How do I report bugs or request new features?**
A: Contact your system administrator or use the feedback mechanism provided in your organization. Include detailed descriptions and steps to reproduce issues.'
                        ]
                    ]
                ];
            default:
                return $this->getDefaultContent($page);
        }
    }

    /**
     * Default content for unimplemented pages
     */
    private function getDefaultContent($page)
    {
        return [
            'title' => ucwords(str_replace('-', ' ', $page)),
            'description' => 'Documentation content for ' . str_replace('-', ' ', $page),
            'sections' => [
                [
                    'heading' => 'Coming Soon',
                    'content' => 'This documentation section is currently being developed. Please check back later for detailed information.'
                ]
            ]
        ];
    }
}
