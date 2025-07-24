<?php

use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\AnomalyController;
use App\Http\Controllers\DataAnalysisController;
use App\Http\Controllers\TestPageController;
use App\Http\Controllers\ContentsController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
    
    // Content Management Routes
    Route::prefix('contents')->name('contents.')->group(function () {
        Route::get('/', [ContentsController::class, 'index'])->name('index');
    });

    // Documentation Routes
    Route::prefix('documentation')->name('documentation.')->group(function () {
        Route::get('/', [DocumentationController::class, 'index'])->name('index');
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
Route::middleware(['auth'])->prefix('api')->name('api.')->group(function () {
    
    // DCS Data Proxy
    Route::get('/dcs-data', function (Request $request) {
        $perfId = $request->query('perf_id');
        $tgl = $request->query('tgl');
        
        if (!$perfId || !$tgl) {
            return response()->json(['error' => 'Missing required parameters: perf_id and tgl'], 400);
        }
        
        // HARDCODED RESPONSE FOR TESTING - Since the external API is not responding
        Log::info('DCS API Call (MOCK MODE)', [
            'perf_id' => $perfId,
            'tgl' => $tgl,
            'note' => 'Using hardcoded response since external API is unreachable',
            'timestamp' => now()->toDateTimeString()
        ]);
        
        // Mock the expected response format based on the actual API response
        $mockResponse = "5\n2025-06-26 09:00:00\n1970-01-01 01:05:00\n1970-01-01 01:10:00\n1970-01-01 01:15:00\n1970-01-01 01:20:00\n1970-01-01 01:25:00\n1970-01-01 01:30:00\n1970-01-01 01:35:00\n1970-01-01 01:40:00\n1970-01-01 01:45:00\n1970-01-01 01:50:00\n1970-01-01 01:55:00\n1970-01-01 02:00:00\n1970-01-01 02:05:00\n1970-01-01 02:10:00\n1970-01-01 02:15:00\n1970-01-01 02:20:00\n1970-01-01 02:25:00\n1970-01-01 02:30:00\n1970-01-01 02:35:00\n1970-01-01 02:40:00\n1970-01-01 02:45:00\n1970-01-01 02:50:00\n1970-01-01 02:55:00\n[{\"sukses\":\"1\"}]";
        
        Log::info('DCS API Response (MOCK)', [
            'status' => 200,
            'successful' => true,
            'body_length' => strlen($mockResponse),
            'body' => $mockResponse,
            'timestamp' => now()->toDateTimeString()
        ]);
        
        // Return successful response with mock data
        return response()->json([
            'success' => true,
            'status' => 200,
            'data' => $mockResponse,
            'headers' => ['content-type' => 'text/plain'],
            'url' => "http://10.7.140.96/PT/get-data/get-dcs.php?perf_id={$perfId}&tgl={$tgl}",
            'note' => 'This is a hardcoded response for testing purposes'
        ]);
        
        /* COMMENTED OUT - Real API call code (uncomment when API is accessible)
        try {
            // Make the external API call
            $apiUrl = "http://10.7.140.96/PT/get-data/get-dcs.php?perf_id=" . urlencode($perfId) . "&tgl=" . urlencode($tgl);
            
            Log::info('DCS API Call', [
                'url' => $apiUrl,
                'perf_id' => $perfId,
                'tgl' => $tgl,
                'timestamp' => now()->toDateTimeString()
            ]);
            
            // Use Laravel's HTTP client with shorter timeout and more options
            $response = Http::timeout(10)
                ->connectTimeout(5)
                ->retry(1, 100)
                ->get($apiUrl);
            
            Log::info('DCS API Response', [
                'status' => $response->status(),
                'successful' => $response->successful(),
                'body_length' => strlen($response->body()),
                'body_preview' => substr($response->body(), 0, 200),
                'headers' => $response->headers(),
                'timestamp' => now()->toDateTimeString()
            ]);
            
            // Return JSON response with structured data
            return response()->json([
                'success' => $response->successful(),
                'status' => $response->status(),
                'data' => $response->body(),
                'headers' => $response->headers(),
                'url' => $apiUrl
            ]);
                
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('DCS API Connection Error', [
                'error' => 'Connection timeout or failed',
                'message' => $e->getMessage(),
                'url' => $apiUrl ?? 'unknown',
                'timestamp' => now()->toDateTimeString()
            ]);
            
            return response()->json([
                'error' => 'Connection failed',
                'message' => 'Unable to connect to DCS API server. The server may be down or unreachable.',
                'details' => $e->getMessage(),
                'url' => $apiUrl ?? 'unknown'
            ], 503);
            
        } catch (\Illuminate\Http\Client\RequestException $e) {
            Log::error('DCS API Request Error', [
                'error' => 'HTTP request failed',
                'message' => $e->getMessage(),
                'response' => $e->response ? $e->response->body() : 'No response',
                'url' => $apiUrl ?? 'unknown',
                'timestamp' => now()->toDateTimeString()
            ]);
            
            return response()->json([
                'error' => 'Request failed',
                'message' => 'DCS API returned an error response.',
                'details' => $e->getMessage(),
                'url' => $apiUrl ?? 'unknown'
            ], 502);
            
        } catch (\Exception $e) {
            Log::error('DCS API General Error', [
                'error' => 'Unexpected error',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'url' => $apiUrl ?? 'unknown',
                'timestamp' => now()->toDateTimeString()
            ]);
            
            return response()->json([
                'error' => 'Unexpected error',
                'message' => 'An unexpected error occurred while calling the DCS API.',
                'details' => $e->getMessage(),
                'url' => $apiUrl ?? 'unknown'
            ], 500);
        }
        */
    })->name('dcs-data');
    
    // Input Tags API
    Route::get('/input-tags', [DataAnalysisController::class, 'getInputTags'])->name('input-tags');
    Route::get('/performance-records', [DataAnalysisController::class, 'getPerformanceRecords'])->name('performance-records');
    
    // Data Analysis API Routes
    Route::prefix('data-analysis')->name('data-analysis.')->group(function () {
        Route::post('/get-data', [DataAnalysisController::class, 'getData'])->name('get-data');
        Route::get('/data', [DataAnalysisController::class, 'getAnalysisData'])->name('data');
        Route::post('/save-manual-input', [DataAnalysisController::class, 'saveManualInput'])->name('save-manual-input');
        Route::get('/export-excel', [DataAnalysisController::class, 'exportAnalysisData'])->name('export-excel');
    });
    
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';