<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Performance;
use App\Models\Unit;

class PerformanceService
{
    /**
     * Get the current unit and its tab count
     */
    public function getCurrentUnit(): ?Unit
    {
        try {
            $selectedUnit = session('selected_unit');
            Log::info('Getting current unit', ['selected_unit' => $selectedUnit]);
            
            if (!$selectedUnit) {
                Log::warning('No unit selected in session');
                return null;
            }

            $unit = Unit::find($selectedUnit);
            Log::info('Unit lookup result', [
                'unit_id' => $selectedUnit,
                'unit_found' => $unit ? true : false,
                'unit_name' => $unit ? $unit->unit_name : 'N/A',
                'tab_manual_aktif' => $unit ? $unit->getActiveTabCount() : 'N/A'
            ]);
            
            return $unit;
        } catch (\Exception $e) {
            Log::error('Error in getCurrentUnit', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Get the active tab count for the current unit
     */
    public function getActiveTabCount(): int
    {
        try {
            $unit = $this->getCurrentUnit();
            $tabCount = $unit ? $unit->getActiveTabCount() : 3;
            
            Log::info('Active tab count determined', [
                'unit_found' => $unit ? true : false,
                'tab_count' => $tabCount
            ]);
            
            return $tabCount; // Default to 3 if unit not found
        } catch (\Exception $e) {
            Log::error('Error in getActiveTabCount', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 3; // Default fallback
        }
    }

    /**
     * Create a new performance record
     */
    public function createPerformanceRecord(Request $request, int $selectedUnit): Performance
    {
        $performance = Performance::create([
            'description' => $request->description,
            'date_perfomance' => $request->dateTime,
            'date_created' => now(),
            'status' => Performance::STATUS_EDITABLE,
            'unit_id' => $selectedUnit,
            'type' => $request->type,
            'weight' => $request->weight,
        ]);

        $performance->refresh();
        $performance->load('unit');

        if (!$performance->perf_id) {
            throw new \Exception('Failed to generate performance ID');
        }

        return $performance;
    }

    /**
     * Call external API to get data
     */
    public function callExternalApi(int $perfId, string $datetime): array
    {
        $apiUrl = "http://10.7.1.141/pt/get-data/get-dcs2.php?perf_id={$perfId}&tgl=" . urlencode($datetime);
        
        $response = Http::timeout(30)->post($apiUrl);
        if (!$response->successful()) {
            throw new \Exception('External API call failed with status: ' . $response->status());
        }

        $responseData = $response->json();
        if (!isset($responseData[0]['sukses']) || $responseData[0]['sukses'] !== '1') {
            throw new \Exception('External API did not return success status');
        }

        return $responseData;
    }

    /**
     * Format performance data for response
     */
    public function formatPerformanceData(Performance $performance): array
    {
        $downloadUrl = null;

        if ($performance->report_filename) {
            $baseUrl = config('app.analysis_server_ip');
            $downloadUrl = rtrim($baseUrl, '/') . '/reports/' . $performance->report_filename;
        }

        return [
            'id' => $performance->perf_id,
            'description' => $performance->description,
            'date_perfomance' => $performance->date_perfomance ? 
                (is_string($performance->date_perfomance) ? $performance->date_perfomance : $performance->date_perfomance->format('Y-m-d H:i:s')) : null,
            'date_created' => $performance->date_created->format('Y-m-d H:i:s'),
            'status' => $performance->status_text,
            'unit_id' => $performance->unit_id,
            'unit_name' => $performance->unit?->unit_name ?? 'Unknown Unit',
            'jumlah_tab_aktif' => $this->getActiveTabCount(), // Get from unit instead of performance
            'report_filename' => $performance->report_filename,
            'report_download_url' => $downloadUrl
        ];
    }

    /**
     * Get all performance records for the current unit
     */
    public function getPerformanceRecords(int $selectedUnit): array
    {
        Log::info('Fetching performance records', [
            'unit_id' => $selectedUnit
        ]);

        // Get performances for the selected unit, ordered by most recent first
        $performances = Performance::forUnit($selectedUnit)
            ->with('unit')
            ->orderBy('date_perfomance', 'desc')
            ->orderBy('perf_id', 'desc')
            ->get()
            ->map(function ($performance) {
                return [
                    'perf_id' => $performance->perf_id,
                    'description' => $performance->description,
                    'date_perfomance' => $performance->date_perfomance ? 
                        (is_string($performance->date_perfomance) ? $performance->date_perfomance : $performance->date_perfomance->format('Y-m-d H:i:s')) : null,
                    'date_created' => $performance->date_created ? $performance->date_created->format('Y-m-d H:i:s') : null,
                    'status' => $performance->status_text,
                    'unit_id' => $performance->unit_id,
                    'unit_name' => $performance->unit ? $performance->unit->unit_name : 'Unknown Unit',
                    'formatted_label' => $performance->description . ' - ' . 
                        ($performance->date_perfomance ? 
                            (is_string($performance->date_perfomance) ? $performance->date_perfomance : $performance->date_perfomance->format('Y-m-d H:i:s')) 
                            : 'No Date')
                ];
            });

        Log::info('Performance records fetched successfully', [
            'total_records' => $performances->count(),
            'unit_id' => $selectedUnit
        ]);

        return $performances->toArray();
    }
}