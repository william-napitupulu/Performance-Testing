<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Unit;
use Illuminate\Support\Facades\Log;

class WarmUpCache
{
    /**
     * Handle an incoming request and warm up cache asynchronously
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Warm up cache after response is sent (async-like behavior)
        if (function_exists('fastcgi_finish_request')) {
            fastcgi_finish_request();
        }
        
        $this->warmUpUserCache();
        
        return $response;
    }
    
    /**
     * Warm up user-specific cache in background
     */
    private function warmUpUserCache()
    {
        try {
            $user = Auth::user();
            if ($user) {
                // Pre-load units for this user in background
                $startTime = microtime(true);
                Unit::getAvailableForUserOptimized($user);
                $endTime = microtime(true);
                
                Log::info('Cache warmed up', [
                    'user_id' => $user->id,
                    'cache_warmup_time_ms' => round(($endTime - $startTime) * 1000, 2)
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Cache warmup failed', [
                'error' => $e->getMessage()
            ]);
        }
    }
}