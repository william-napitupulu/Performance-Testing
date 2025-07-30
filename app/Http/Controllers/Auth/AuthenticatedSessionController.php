<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Unit;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $startTime = microtime(true);
        
        Log::info('Login attempt started', [
            'username' => $request->username,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'start_time' => $startTime
        ]);

        try {
            // Use the LoginRequest's authenticate method which handles rate limiting and validation
            $authStartTime = microtime(true);
            $request->authenticate();
            $authEndTime = microtime(true);
            
            $user = Auth::user();
            
            Log::info('Authentication successful', [
                'user_id' => $user->id,
                'user_name' => $user->nama,
                'plant_id' => $user->plant_id,
                'can_access_all_units' => $user->canAccessAllUnits(),
                'auth_time_ms' => round(($authEndTime - $authStartTime) * 1000, 2)
            ]);

            $sessionStartTime = microtime(true);
            $request->session()->regenerate();
            $sessionEndTime = microtime(true);

            Log::info('Session regeneration completed', [
                'user_id' => $user->id,
                'session_regenerate_time_ms' => round(($sessionEndTime - $sessionStartTime) * 1000, 2)
            ]);

            // Check if user needs to select a unit
            $unitsStartTime = microtime(true);
            $availableUnits = Unit::getAvailableForUser($user);
            $unitsEndTime = microtime(true);
            
            Log::info('Available units for user', [
                'user_id' => $user->id,
                'available_units_count' => $availableUnits->count(),
                'units_query_time_ms' => round(($unitsEndTime - $unitsStartTime) * 1000, 2),
                'units' => $availableUnits->map(function($unit) {
                    return [
                        'unit_id' => $unit->unit_id,
                        'unit_name' => $unit->unit_name,
                        'plant_id' => $unit->plant_id,
                        'status' => $unit->status
                    ];
                })
            ]);

            if ($availableUnits->count() > 1) {
                $totalTime = round((microtime(true) - $startTime) * 1000, 2);
                Log::info('Login completed - redirecting to unit selection', [
                    'user_id' => $user->id,
                    'total_login_time_ms' => $totalTime
                ]);
                
                // Multiple units available, force a full page redirect so the new CSRF token is sent to the client
                return \Inertia\Inertia::location(route('unit.select'));
            } elseif ($availableUnits->count() === 1) {
                // Only one unit available, auto-select it
                $unit = $availableUnits->first();
                session(['selected_unit' => $unit->unit_id]);
                
                $totalTime = round((microtime(true) - $startTime) * 1000, 2);
                Log::info('Auto-selected unit', [
                    'user_id' => $user->id,
                    'selected_unit_id' => $unit->unit_id,
                    'unit_name' => $unit->unit_name,
                    'total_login_time_ms' => $totalTime
                ]);
                
                // Force full reload so updated CSRF token is present in meta tag
                return \Inertia\Inertia::location(route('dashboard'));
            } else {
                // No units available
                $totalTime = round((microtime(true) - $startTime) * 1000, 2);
                Log::warning('No units available for user', [
                    'user_id' => $user->id,
                    'plant_id' => $user->plant_id,
                    'total_login_time_ms' => $totalTime
                ]);
                
                Auth::logout();
                return back()->withErrors([
                    'username' => 'No units are available for your account. Please contact administrator.',
                ]);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle authentication failures and rate limiting
            Log::warning('Authentication failed', [
                'username' => $request->username,
                'ip_address' => $request->ip(),
                'errors' => $e->errors()
            ]);
            
            // Return back to login form with errors
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            Log::error('Unexpected error during authentication', [
                'username' => $request->username,
                'ip_address' => $request->ip(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'username' => 'An unexpected error occurred. Please try again.',
            ]);
        }
    }

    /**
     * Show unit selection page.
     */
    public function selectUnit()
    {
        $startTime = microtime(true);
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $unitsStartTime = microtime(true);
        $availableUnits = Unit::getAvailableForUser($user);
        $unitsEndTime = microtime(true);
        
        Log::info('Unit selection page accessed', [
            'user_id' => $user->id,
            'available_units_count' => $availableUnits->count(),
            'units_query_time_ms' => round(($unitsEndTime - $unitsStartTime) * 1000, 2)
        ]);

        $renderStartTime = microtime(true);
        
        // Send minimal data - let React component load units via API for better performance
        $response = Inertia::render('auth/select-unit', [
            'units' => [], // Send empty array initially
            'user' => [
                'id' => $user->id,
                'name' => $user->nama,
                'plant_id' => $user->plant_id,
                'can_access_all_units' => $user->canAccessAllUnits()
            ],
            'units_count' => $availableUnits->count(),
            'load_units_url' => route('api.units.load')
        ]);
        $renderEndTime = microtime(true);
        
        $totalTime = round((microtime(true) - $startTime) * 1000, 2);
        Log::info('Unit selection page rendered', [
            'user_id' => $user->id,
            'inertia_render_time_ms' => round(($renderEndTime - $renderStartTime) * 1000, 2),
            'total_page_time_ms' => $totalTime
        ]);
        
        return $response;
    }

    /**
     * Handle unit selection.
     */
    public function storeUnit(Request $request): RedirectResponse
    {
        $startTime = microtime(true);
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $validateStartTime = microtime(true);
        $request->validate([
            'unit_id' => 'required|integer'
        ]);
        $validateEndTime = microtime(true);

        $unitId = $request->unit_id;
        
        $unitsStartTime = microtime(true);
        $availableUnits = Unit::getAvailableForUser($user);
        $unitsEndTime = microtime(true);
        
        // Verify the selected unit is available for this user
        $selectedUnit = $availableUnits->where('unit_id', $unitId)->first();
        
        Log::info('Unit selection processing', [
            'user_id' => $user->id,
            'requested_unit_id' => $unitId,
            'validation_time_ms' => round(($validateEndTime - $validateStartTime) * 1000, 2),
            'units_query_time_ms' => round(($unitsEndTime - $unitsStartTime) * 1000, 2)
        ]);
        
        if (!$selectedUnit) {
            Log::warning('Invalid unit selection attempt', [
                'user_id' => $user->id,
                'attempted_unit_id' => $unitId,
                'available_units' => $availableUnits->pluck('unit_id')
            ]);
            
            return back()->withErrors([
                'unit_id' => 'The selected unit is not available for your account.'
            ]);
        }

        // Store selected unit in session
        $sessionStartTime = microtime(true);
        session(['selected_unit' => $unitId]);
        $sessionEndTime = microtime(true);
        
        $totalTime = round((microtime(true) - $startTime) * 1000, 2);
        Log::info('Unit selected successfully', [
            'user_id' => $user->id,
            'selected_unit_id' => $unitId,
            'unit_name' => $selectedUnit->unit_name,
            'session_store_time_ms' => round(($sessionEndTime - $sessionStartTime) * 1000, 2),
            'total_unit_selection_time_ms' => $totalTime
        ]);

        return redirect()->intended(route('performance.index'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $user = Auth::user();
        
        Log::info('User logout', [
            'user_id' => $user ? $user->id : 'unknown',
            'user_name' => $user ? $user->nama : 'unknown'
        ]);

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Force full page reload so the new CSRF token meta tag is refreshed
        return \Inertia\Inertia::location(route('login'));
    }
}
