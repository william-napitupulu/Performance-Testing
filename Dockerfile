# --- Stage 1: The "Builder" ---
# This stage builds our front-end assets
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# --- Stage 2: The "Final Application" ---
# This stage builds the lean, final PHP image
FROM php:8.2-fpm-alpine

WORKDIR /app

# Install required system packages and PHP extensions
RUN apk add --no-cache libzip-dev zip unzip && \
    docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files and install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code from the builder stage (excluding node_modules)
COPY --from=builder /app .

# Copy the compiled assets from the builder stage
COPY --from=builder /app/public/build ./public/build

# Set permissions for Laravel
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose the PHP-FPM port
EXPOSE 9000
CMD ["php-fpm"]