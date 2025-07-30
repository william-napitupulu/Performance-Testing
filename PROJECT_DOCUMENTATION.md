# Performance Testing - Anomaly Detection System Documentation

## Overview

The Performance Testing - Anomaly Detection System is a specialized Laravel + React application designed for performance benchmarking, load testing, and optimization analysis of anomaly detection systems. This application is built using modern web technologies with a focus on scalability and performance monitoring.

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Design](#database-design)
4. [Backend Components](#backend-components)
5. [Frontend Architecture](#frontend-architecture)
6. [Authentication & Security](#authentication--security)
7. [Deployment & Docker](#deployment--docker)
8. [Development Setup](#development-setup)
9. [API Documentation](#api-documentation)
10. [Performance Features](#performance-features)

## Project Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + TS    │◄──►│   Laravel 12    │◄──►│   MySQL         │
│   Inertia.js    │    │   PHP 8.2       │    │   Multi-DB      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Build Tools   │    │   Services      │    │   External API  │
│   Vite 6        │    │   Middleware    │    │   DCS System    │
│   Tailwind CSS  │    │   Controllers   │    │   10.7.146.114  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Directory Structure

```
Performance-Testing/
├── app/                          # Laravel application code
│   ├── Auth/                     # Custom authentication
│   ├── Console/Commands/         # Artisan commands
│   ├── Http/                     # Controllers, middleware, requests
│   ├── Models/                   # Eloquent models
│   └── Services/                 # Business logic services
├── resources/
│   ├── js/                       # React frontend
│   │   ├── components/           # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── layouts/             # Layout components
│   │   └── types/               # TypeScript definitions
│   └── views/                   # Blade templates
├── database/                     # Migrations and seeders
├── docker/                       # Docker configuration
└── config/                       # Laravel configuration files
```

## Technology Stack

### Backend
- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Database**: MySQL (multi-connection)
- **Authentication**: Custom User Provider
- **API Integration**: HTTP Client for external DCS system

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **State Management**: Inertia.js
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Custom components
- **Charts**: Chart.js with React integration

### Development Tools
- **Build Tool**: Vite 6
- **Testing**: Pest PHP
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm
- **Containerization**: Docker with webdevops/php-apache

## Database Design

### Primary Connections

1. **mysql (pt database)** - Main application database
2. **soket (db_soket)** - Socket communication data
3. **pacitan (db_pacitan_1)** - Plant-specific data

### Key Models and Relationships

#### User Model (`tb_user`)
```php
- id (string) - Primary key, username
- nama (string) - Display name
- kode (string) - User code
- password (hashed) - Authentication
- plant_id (integer) - Plant association
- status (integer) - User status
- remember_token - Session management
```

#### Performance Model (`pt.tb_performance`)
```php
- perf_id (auto-increment) - Primary key
- description (string) - Test description
- date_perfomance (datetime) - Test date/time
- date_created (datetime) - Record creation
- status (integer) - 0=Locked, 1=Editable
- unit_id (integer) - Associated unit
- type (enum) - Test type classification
- weight (enum) - Load classification
```

#### Unit Model (`tb_unit`)
```php
- unit_id (integer) - Primary key
- unit_name (string) - Unit display name
- status (integer) - Active status
- plant_id (integer) - Plant association
- tab_manual_aktif (integer) - Active tab count
```

### Database Relationships

```
User ──────► Plant (1:many via plant_id)
     └─────► Units (via plant_id, conditional access)

Unit ──────► Performance (1:many)
     └─────► Plant (belongs to)

Performance ► Unit (belongs to)
           └► InputData (1:many via perf_id)
```

## Backend Components

### Controllers

#### PerformanceController
**Location**: `app/Http/Controllers/PerformanceController.php`

- **index()**: Display performance list with filtering
- **store()**: Create new performance records
- **update()**: Modify existing records (if editable)
- **destroy()**: Delete records and related data

#### DataAnalysisController
**Location**: `app/Http/Controllers/DataAnalysisController.php`

Handles complex data analysis operations including:
- Multi-tab data processing
- External API integration
- Performance metric calculations
- Export functionality

#### AuthenticatedSessionController
**Location**: `app/Http/Controllers/Auth/AuthenticatedSessionController.php`

Custom authentication flow:
- Multi-step login process
- Unit selection after authentication
- Session management with performance logging
- CSRF token handling for SPA

### Services

#### PerformanceService
**Location**: `app/Services/PerformanceService.php`

Core business logic for performance testing:

```php
// Key methods:
- getCurrentUnit(): Unit session management
- getActiveTabCount(): Dynamic tab configuration
- createPerformanceRecord(): Record creation with validation
- callExternalApi(): DCS system integration
- formatPerformanceData(): Response formatting
- getPerformanceRecords(): Data retrieval with filtering
```

#### DataAnalysisService
**Location**: `app/Services/DataAnalysisService.php`

Advanced analytics capabilities:
- Statistical analysis
- Anomaly detection algorithms
- Performance benchmarking
- Data export in multiple formats

### Middleware

#### EnsurePlantAndUnitSelected
**Location**: `app/Http/Middleware/EnsurePlantAndUnitSelected.php`

Security middleware ensuring proper session state:
- Validates unit selection
- Enforces access controls
- Redirects unauthorized access

#### WarmUpCache
**Location**: `app/Http/Middleware/WarmUpCache.php`

Performance optimization middleware for caching frequently accessed data.

## Frontend Architecture

### Component Structure

```
components/
├── ui/                           # Base UI components (Radix-based)
│   ├── button.tsx
│   ├── card.tsx
│   ├── chart.tsx
│   └── ...
├── project-components/           # Feature-specific components
│   ├── DataAnalysisComponents/
│   │   ├── DataAnalysisContainer.tsx
│   │   ├── UnifiedTabTemplate.tsx
│   │   └── Tab1Components/
│   └── PerformanceListComponents/
│       ├── PerformanceListContainer.tsx
│       └── PerformanceTableRow.tsx
└── layouts/                      # Layout components
    ├── app-layout.tsx
    └── auth-layout.tsx
```

### Key Pages

#### Data Analysis (`pages/data-analysis.tsx`)
**Location**: `resources/js/pages/data-analysis.tsx`

Main application interface featuring:
- Multi-tab data input system
- Real-time performance monitoring
- Interactive charts and visualizations
- Export functionality

#### Performance List (`pages/performance-list.tsx`)
**Location**: `resources/js/pages/performance-list.tsx`

Performance record management:
- CRUD operations for test records
- Filtering and search capabilities
- Status management (Editable/Locked)
- Calendar-based date selection

### State Management

#### Unified Tab System
**Location**: `resources/js/components/project-components/DataAnalysisComponents/shared/UniversalTabContext.tsx`

Centralized state management for:
- Tab configuration
- Data synchronization
- Form validation
- API communication

### Styling System

#### Tailwind Configuration
**Location**: `tailwind.config.js`

Custom design system with:
- Extended color palette
- Custom component variants
- Responsive design utilities
- Performance optimizations

## Authentication & Security

### Custom Authentication Provider
**Location**: `app/Auth/CustomUserProvider.php`

Enhanced authentication system featuring:

#### Security Features
- **Password Hashing**: Automatic bcrypt hashing with backward compatibility
- **Performance Logging**: Detailed authentication timing metrics
- **Session Security**: Secure token management
- **Rate Limiting**: Built-in protection against brute force attacks

#### Authentication Flow
1. **Credential Validation**: Username/password verification
2. **Unit Access Check**: Validates user's unit permissions  
3. **Session Creation**: Secure session establishment
4. **Unit Selection**: Multi-unit support with automatic selection
5. **CSRF Protection**: Token-based request validation

#### Access Control
```php
// User access patterns:
- plant_id = 1: Access to all units (admin level)
- plant_id > 1: Restricted to specific plant units
- status = 1: Active user account
- Unit-level permissions via middleware
```

### Security Middleware Stack
1. **EnsurePlantAndUnitSelected**: Session validation
2. **HandleInertiaRequests**: CSRF and state management
3. **WarmUpCache**: Performance security
4. **HandleAppearance**: UI state security

### Password Security
- **Bcrypt hashing** with automatic detection
- **Plain text fallback** for legacy compatibility
- **Timing attack protection** via consistent validation
- **Performance monitoring** for security analysis

## Deployment & Docker

### Docker Configuration

#### Docker Compose (`docker-compose.yml`)
```yaml
services:
  app:
    image: webdevops/php-apache:8.2
    container_name: performance-testing-app
    ports:
      - "8000:80"
    environment:
      - PHP_MEMORY_LIMIT=512M
      - PHP_MAX_EXECUTION_TIME=300
      - WEB_DOCUMENT_ROOT=/app/public
```

#### Automated Setup (`docker-setup.bat`)
Complete deployment automation:
1. Container cleanup and system pruning
2. Image deployment (pre-built)
3. Dependency installation (Composer + npm)
4. Asset compilation and optimization
5. Laravel configuration caching
6. Permission management
7. Health checks and validation

#### Apache Configuration (`docker/apache.conf`)
```apache
DocumentRoot /app/public
<Directory /app/public>
    AllowOverride All
    Require all granted
    Options -Indexes +FollowSymLinks
</Directory>
```

### Production Optimizations
- **Asset bundling** with Vite manual chunks
- **PHP optimizations** with OPcache
- **Database connection pooling**
- **Static file serving** via Apache
- **Memory management** (512MB limit)
- **Execution time limits** (300s for heavy operations)

## Development Setup

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- Docker (optional)

### Installation Steps

1. **Clone and Navigate**
   ```bash
   cd Performance-Testing
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**
   ```bash
   php artisan migrate
   ```

5. **Development Server**
   ```bash
   # Option 1: Separate processes
   php artisan serve
   npm run dev
   
   # Option 2: Combined
   composer run dev
   ```

### Development Commands

```bash
# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run build:ssr    # SSR build
npm run lint         # Code linting
npm run format       # Code formatting

# Backend
composer run dev     # Full development stack
composer run test    # PHP testing
php artisan migrate  # Database migrations
```

## API Documentation

### External API Integration

#### DCS System Integration
**Endpoint**: `http://10.7.146.114/pt/get-data/get-dcs2.php`

**Usage in PerformanceService**:
```php
public function callExternalApi(int $perfId, string $datetime): array
{
    $apiUrl = "http://10.7.146.114/pt/get-data/get-dcs2.php?perf_id={$perfId}&tgl=" . urlencode($datetime);
    
    $response = Http::timeout(30)->post($apiUrl);
    // Error handling and response validation
}
```

### Internal API Endpoints

#### Performance Management
- `GET /performance` - List performance records
- `POST /performance` - Create new record
- `PUT /performance/{id}` - Update record
- `DELETE /performance/{id}` - Delete record

#### Data Analysis
- `POST /data-analysis/process` - Process analysis data
- `GET /data-analysis/{id}` - Retrieve analysis results
- `POST /data-analysis/export` - Export data

#### Authentication
- `POST /login` - User authentication
- `POST /logout` - Session termination
- `GET /unit/select` - Unit selection interface
- `POST /unit/select` - Unit selection processing

## Performance Features

### Performance Testing Capabilities

#### Load Testing Features
- **Concurrent User Simulation**: Multi-session testing
- **Resource Monitoring**: Memory, CPU, and database performance
- **Response Time Analysis**: Detailed timing metrics
- **Throughput Testing**: Request/second capacity testing

#### Benchmarking System
- **Performance Baselines**: Historical comparison data
- **Metric Collection**: Automated performance data gathering
- **Trend Analysis**: Long-term performance tracking
- **Optimization Recommendations**: Automated suggestions

#### Monitoring and Analytics
- **Real-time Dashboards**: Live performance visualization
- **Alert System**: Performance threshold notifications
- **Export Capabilities**: Multiple format support (CSV, PDF, Excel)
- **Custom Reports**: Configurable reporting system

### Technical Performance Optimizations

#### Frontend Optimizations
```typescript
// Vite configuration with optimizations
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        inertia: ['@inertiajs/react'],
      },
    },
  },
}
```

#### Backend Optimizations
- **Database Query Optimization**: Eager loading, indexing
- **Caching Strategy**: Multi-level caching system
- **Memory Management**: Efficient resource utilization
- **Connection Pooling**: Database connection optimization

#### Infrastructure Optimizations
- **Docker Multi-stage Builds**: Reduced image sizes
- **Asset Optimization**: Minification and compression
- **CDN Integration**: Static asset delivery
- **Load Balancing**: Horizontal scaling preparation

---

## Conclusion

This Performance Testing - Anomaly Detection System represents a comprehensive solution for performance analysis and optimization. The architecture supports high-scale testing scenarios while maintaining code quality and security standards. The system is designed for continuous improvement and can be extended to meet evolving performance testing requirements.

For additional support or questions, refer to the README.md file or consult the inline code documentation.