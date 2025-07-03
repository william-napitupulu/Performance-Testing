<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Unit;
use Illuminate\Http\Response as LaravelResponse;

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
    public function store(LoginRequest $request): LaravelResponse
    {
        Log::info('Login attempt started', [
            'username' => $request->username,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // Attempt authentication
        $credentials = $request->only('username', 'password');
        
        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();
            
            Log::info('Authentication successful', [
                'user_id' => $user->id,
                'user_name' => $user->nama,
                'plant_id' => $user->plant_id,
                'can_access_all_units' => $user->canAccessAllUnits()
            ]);

            $request->session()->regenerate();

            // Check if user needs to select a unit
            $availableUnits = Unit::getAvailableForUser($user);
            
            Log::info('Available units for user', [
                'user_id' => $user->id,
                'available_units_count' => $availableUnits->count(),
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
                // Multiple units available, force a full page redirect so the new CSRF token is sent to the client
                return \Inertia\Inertia::location(route('unit.select'));
            } elseif ($availableUnits->count() === 1) {
                // Only one unit available, auto-select it
                $unit = $availableUnits->first();
                session(['selected_unit' => $unit->unit_id]);
                
                Log::info('Auto-selected unit', [
                    'user_id' => $user->id,
                    'selected_unit_id' => $unit->unit_id,
                    'unit_name' => $unit->unit_name
                ]);
                
                // Force full reload so updated CSRF token is present in meta tag
                return \Inertia\Inertia::location(route('dashboard'));
            } else {
                // No units available
                Log::warning('No units available for user', [
                    'user_id' => $user->id,
                    'plant_id' => $user->plant_id
                ]);
                
                Auth::logout();
                return back()->withErrors([
                    'username' => 'No units are available for your account. Please contact administrator.',
                ]);
            }
        }

        Log::warning('Authentication failed', [
            'username' => $request->username,
            'ip_address' => $request->ip()
        ]);

        return back()->withErrors([
            'username' => 'Username or password is invalid.',
        ]);
    }

    /**
     * Show unit selection page.
     */
    public function selectUnit(): Response
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $availableUnits = Unit::getAvailableForUser($user);
        
        Log::info('Unit selection page accessed', [
            'user_id' => $user->id,
            'available_units_count' => $availableUnits->count()
        ]);

        return Inertia::render('auth/select-unit', [
            'units' => $availableUnits->map(function($unit) {
                return [
                    'value' => $unit->unit_id,
                    'label' => $unit->getDisplayText(),
                    'plant_id' => $unit->plant_id,
                    'status' => $unit->status
                ];
            }),
            'user' => [
                'id' => $user->id,
                'name' => $user->nama,
                'plant_id' => $user->plant_id,
                'can_access_all_units' => $user->canAccessAllUnits()
            ]
        ]);
    }

    /**
     * Handle unit selection.
     */
    public function storeUnit(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }

        $request->validate([
            'unit_id' => 'required|integer'
        ]);

        $unitId = $request->unit_id;
        $availableUnits = Unit::getAvailableForUser($user);
        
        // Verify the selected unit is available for this user
        $selectedUnit = $availableUnits->where('unit_id', $unitId)->first();
        
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
        session(['selected_unit' => $unitId]);
        
        Log::info('Unit selected successfully', [
            'user_id' => $user->id,
            'selected_unit_id' => $unitId,
            'unit_name' => $selectedUnit->unit_name
        ]);

        return redirect()->intended(route('performance.index'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): LaravelResponse
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
