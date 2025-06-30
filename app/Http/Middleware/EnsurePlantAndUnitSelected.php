<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helpers\SessionHelper;
use Symfony\Component\HttpFoundation\Response;

class EnsurePlantAndUnitSelected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip this check for login, logout, and auth routes
        if ($request->routeIs('login') || 
            $request->routeIs('logout') ||
            $request->is('login') ||
            $request->is('logout')) {
            return $next($request);
        }

        // Only check for authenticated users
        if (auth()->check()) {
            \Log::info('Middleware check', [
                'route' => $request->route()?->getName(),
                'url' => $request->url(),
                'has_plant_unit' => SessionHelper::hasPlantAndUnit(),
                'session_data' => [
                    'plant_id' => session('current_plant_id'),
                    'unit_id' => session('current_unit_id'),
                ]
            ]);

            if (!SessionHelper::hasPlantAndUnit()) {
                \Log::warning('Plant/Unit not selected, redirecting to login');
                // Redirect to login with a message to select plant and unit
                return redirect()->route('login')->with('error', 'Please select a plant and unit to continue.');
            }
        }

        return $next($request);
    }
} 