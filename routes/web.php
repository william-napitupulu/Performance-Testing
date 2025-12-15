<?php

use App\Http\Controllers\BaselineController;
use App\Http\Controllers\OutputController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\AnomalyController;
use App\Http\Controllers\DataAnalysisController;
use App\Http\Controllers\TestPageController;
use App\Http\Controllers\ContentsController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\TrendingController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Unit;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Root route - handle both guest and authenticated users
Route::get('/', function () {
    \Log::info('Root route accessed', [
        'is_authenticated' => auth()->check(),
        'user_id' => auth()->id(),
        'selected_unit' => session('selected_unit'),
        'url' => request()->fullUrl(),
        'user_agent' => request()->userAgent()
    ]);
    
    if (auth()->guest()) {
        \Log::info('Redirecting guest to login');
        return redirect('/login');
    }
    
    // User is authenticated, check if unit is selected
    $selectedUnit = session('selected_unit');
    if (!$selectedUnit) {
        \Log::info('Authenticated user has no unit selected, redirecting to unit selection');
        return redirect()->route('unit.select');
    }
    
    // User is authenticated and has selected a unit, go to performance
    \Log::info('Authenticated user with unit selected, redirecting to performance', [
        'selected_unit' => $selectedUnit
    ]);
    return redirect()->route('performance.index');
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Unit Selection Routes
    Route::prefix('select-unit')->name('unit.')->group(function () {
        Route::get('/', [AuthenticatedSessionController::class, 'selectUnit'])->name('select');
        Route::post('/', [AuthenticatedSessionController::class, 'storeUnit'])->name('store');
    });
    
    // Performance Management Routes
    Route::prefix('performance')->name('performance.')->group(function () {
        Route::get('/', [PerformanceController::class, 'index'])->name('index');
        Route::post('/', [PerformanceController::class, 'store'])->name('store');
        Route::put('/{id}', [PerformanceController::class, 'update'])->name('update');
        Route::delete('/{id}', [PerformanceController::class, 'destroy'])->name('destroy');
    });
    
    // Data Analysis Routes
    Route::prefix('data-analysis')->name('data-analysis.')->group(function () {
        Route::get('/', [DataAnalysisController::class, 'index'])->name('index');
        Route::post('/get-data', [DataAnalysisController::class, 'getData'])->name('get-data');
    });
    
    // Anomaly Detection Routes
    Route::prefix('anomaly')->name('anomaly.')->group(function () {
        Route::get('/', [AnomalyController::class, 'index'])->name('index');
    });

    Route::prefix('output')->name('output.')->group(function () {
        Route::get('/', [OutputController::class, 'index'])->name('index');
        Route::get('/performance', [OutputController::class, 'performance'])->name('performance');
    });

    Route::prefix('baseline')->name('baseline.')->group(function () {
        Route::get('/', [BaselineController::class, 'index'])->name('index');
    });
    
    // Content Management Routes
    Route::prefix('trending')->name('trending.')->group(function () {
        Route::get('/', [TrendingController::class, 'index'])->name('index');
        // Returns the list of setups (Combustion, Boiler Eff, etc.)
        Route::get('/templates', [TrendingController::class, 'getTemplates']);
        
        // Returns the raw data points for the chart
        Route::get('/data', [TrendingController::class, 'getChartData']);
        Route::get('/tags', [TrendingController::class, 'getTags']);
        Route::post('/templates', [TrendingController::class, 'store']);
    });

    // Documentation Routes
    Route::prefix('documentation')->name('documentation.')->group(function () {
        Route::get('/', [DocumentationController::class, 'index'])->name('index');
        Route::get('/{section}', [DocumentationController::class, 'index'])->name('section');
        Route::get('/{section}/{page}', [DocumentationController::class, 'index'])->name('page');
    });

    // Test/Debug Routes (Development only)
    Route::prefix('test')->name('test.')->group(function () {
        Route::get('/page', [TestPageController::class, 'index'])->name('page');
        Route::post('/debug/auth', function (Request $request) {
            return response()->json([
                'success' => true,
                'message' => 'Authentication and CSRF working',
                'user_id' => auth()->user()->id ?? 'No user',
                'csrf_token' => csrf_token(),
                'request_data' => $request->all(),
                'headers' => $request->headers->all()
            ]);
        })->name('debug.auth');
    });

    
});

/*
|--------------------------------------------------------------------------
| API Routes (Authenticated)
|--------------------------------------------------------------------------
*/
Route::middleware(['web', 'auth'])->prefix('api')->name('api.')->group(function () {
    
    
    // Input Tags API
    Route::get('/input-tags', [DataAnalysisController::class, 'getInputTags'])->name('input-tags');
    Route::get('/performance-records', [DataAnalysisController::class, 'getPerformanceRecords'])->name('performance-records');
    
    // Units API
    Route::get('/units/load', function(Request $request) {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $search = $request->query('search', '');
        $page = (int) $request->query('page', 1);
        $limit = (int) $request->query('limit', 20);
        
        $availableUnits = Unit::getAvailableForUser($user);
        
        // Apply search filter if provided
        if ($search) {
            $availableUnits = $availableUnits->filter(function($unit) use ($search) {
                return stripos($unit->unit_name, $search) !== false;
            });
        }
        
        // Apply pagination
        $offset = ($page - 1) * $limit;
        $paginatedUnits = $availableUnits->slice($offset, $limit);
        
        return response()->json([
            'units' => $paginatedUnits->map(function($unit) {
                return [
                    'value' => $unit->unit_id,
                    'label' => $unit->getDisplayText(),
                    'plant_id' => $unit->plant_id,
                    'status' => $unit->status
                ];
            })->values(),
            'total' => $availableUnits->count(),
            'page' => $page,
            'has_more' => $availableUnits->count() > ($offset + $limit)
        ]);
    })->name('units.load');
    
    // Data Analysis API Routes
    Route::prefix('data-analysis')->name('data-analysis.')->group(function () {
        Route::post('/get-data', [DataAnalysisController::class, 'getData'])->name('get-data');
        Route::get('/data', [DataAnalysisController::class, 'getAnalysisData'])->name('data');
        Route::post('/save-manual-input', [DataAnalysisController::class, 'saveManualInput'])->name('save-manual-input');
        Route::get('/export-excel', [DataAnalysisController::class, 'exportAnalysisData'])->name('export-excel');
        Route::post('/{performance}/run', [DataAnalysisController::class, 'runAnalysis'])->name('run');
        Route::get('/check/{performance}', [DataAnalysisController::class, 'CheckStatus'])->name('check');
    });

    Route::prefix('output')->name('output.')->group(function () {
        Route::prefix('/details')->name('details.')->group(function () {
            Route::get('/', [OutputController::class, 'index'])->name('index');
            Route::get('/data', [OutputController::class, 'getOutputData'])->name('data');
        });
        Route::get('/pareto/{performance}/{reference}', [OutputController::class, 'getTop10OutputBaselineDifference'])->name('pareto');
        Route::get('/references', [OutputController::class, 'getAvailableReference'])->name('reference');
        Route::get('/download/{performances}', [OutputController::class, 'downloadReport'])->name('download-report');
        Route::post('/create-baseline', [OutputController::class, 'createBaseline'])->name('create-baseline');
        Route::get('/comparison/{performance}/{reference}', [OutputController::class, 'getOutputAndBaseline'])->name('comparison');
    });

    Route::prefix('baseline')->name('baseline.')->group(function () {
        Route::get('/{refference}', [BaselineController::class, 'show'])->name('show');
        Route::post('/{refference}/set-default', [BaselineController::class, 'setDefault'])->name('set-default');
        Route::delete('/{refference}', [BaselineController::class, 'destroy'])->name('destroy');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';