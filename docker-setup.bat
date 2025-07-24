@echo off
echo Starting Docker setup for Performance Testing...
echo.

echo Step 1: Cleaning up any existing containers...
docker-compose -f docker-compose.yml down --volumes --remove-orphans 2>nul
docker system prune -f

echo.
echo Step 2: Starting containers with pre-built images (no building required)...
docker-compose -f docker-compose.yml up -d

echo.
echo Step 3: Waiting for containers to start...
timeout /t 10

echo.
echo Step 4: Installing PHP dependencies...
docker-compose -f docker-compose.yml exec -T app composer install --no-dev --optimize-autoloader

echo.
echo Step 5: Installing Node dependencies...
docker-compose -f docker-compose.yml exec -T app npm install

echo.
echo Step 6: Building frontend assets...
docker-compose -f docker-compose.yml exec -T app npm run build

echo.
echo Step 7: Setting up Laravel...
docker-compose -f docker-compose.yml exec -T app php artisan config:cache
docker-compose -f docker-compose.yml exec -T app php artisan route:cache

echo.
echo Step 8: Setting permissions...
docker-compose -f docker-compose.yml exec -T app chown -R application:application /app
docker-compose -f docker-compose.yml exec -T app chmod -R 755 /app/storage
docker-compose -f docker-compose.yml exec -T app chmod -R 755 /app/bootstrap/cache

echo.
echo ====================================
echo SUCCESS! Your application is ready!
echo ====================================
echo.
echo Access your application at: http://10.7.1.253:8000
echo.
echo To view logs: docker-compose -f docker-compose.yml logs -f app
echo To stop: docker-compose -f docker-compose.yml down
echo.
pause