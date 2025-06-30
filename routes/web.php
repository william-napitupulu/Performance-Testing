<?php

use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\AnomalyController;
use App\Http\Controllers\DataAnalysisController;
use App\Http\Controllers\TestPageController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
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

// Public Routes
Route::get('/', function () {
    return redirect('/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/performance', function () {
        return Inertia::render('performance');
    })->name('performance.index');
    
    // Main Performance List Route - Protected
    Route::get('/performance', [PerformanceController::class, 'index'])->name('performance.index');
    Route::post('/performance', [PerformanceController::class, 'store'])->name('performance.store');
    Route::put('/performance/{id}', [PerformanceController::class, 'update'])->name('performance.update');
    Route::delete('/performance/{id}', [PerformanceController::class, 'destroy'])->name('performance.destroy');
    
    // Anomaly Detection Route - Protected
    Route::get('/anomaly', [AnomalyController::class, 'index'])->name('anomaly.index');
    
    // Data Analysis Routes - Protected
    Route::get('/data-analysis', [DataAnalysisController::class, 'index'])->name('data-analysis.index');
    Route::post('/data-analysis/get-data', [DataAnalysisController::class, 'getData'])->name('data-analysis.get-data');
    
    // Unit Selection Routes - Protected
    Route::get('/select-unit', [AuthenticatedSessionController::class, 'selectUnit'])->name('unit.select');
    Route::post('/select-unit', [AuthenticatedSessionController::class, 'storeUnit'])->name('unit.store');

    Route::get('/test-page', [TestPageController::class, 'index'])->name('test-page');
});

// DCS Data API Proxy
Route::get('/api/dcs-data', function (Request $request) {
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
})->middleware('auth');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';