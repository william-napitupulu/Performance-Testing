# Performance Testing - Anomaly Detector

A performance testing version of the Anomaly Detection System for monitoring and analyzing system anomalies. This project is built using Laravel and React with the same styling and configuration as the main Anomaly-Detector project.

## Purpose

This project is specifically designed for:
- **Performance benchmarking** of the anomaly detection system
- **Load testing** under various conditions
- **Optimization testing** for different configurations
- **Scalability analysis** for production deployment

## Requirements

- PHP 8.2+
- Node.js 18+
- Composer
- npm/yarn

## Installation

1. Navigate to the project directory:
```bash
cd Performance-Testing
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install JavaScript dependencies:
```bash
npm install
```

4. Copy the environment file:
```bash
cp .env.example .env
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run migrations:
```bash
php artisan migrate
```

## Development

To start the development server:

```bash
php artisan serve
```

In a separate terminal, run:

```bash
npm run dev
```

Or use the combined development command:

```bash
composer run dev
```

## Performance Testing Features

This version includes all the same features as the main Anomaly-Detector but is optimized for:

- **Load Testing**: Handling multiple concurrent users
- **Stress Testing**: Testing system limits
- **Performance Monitoring**: Built-in performance metrics
- **Benchmarking**: Comparative performance analysis

## Configuration

All styling, dependencies, and configurations are identical to the main Anomaly-Detector project:

- **Frontend**: React 19 with TypeScript
- **Backend**: Laravel 12
- **Styling**: Tailwind CSS 4 with custom theme
- **Build Tool**: Vite 6
- **Testing**: Pest PHP

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:ssr` - Build with SSR support
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `composer run dev` - Start full development stack
- `composer run test` - Run PHP tests

## License

[MIT](LICENSE) 