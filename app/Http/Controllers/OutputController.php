<?php

namespace App\Http\Controllers;

use App\Models\Performance;
use App\Models\Unit;
use App\Services\OutputService;
use App\Services\PerformanceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OutputController extends Controller
{
    private OutputService $outputService;
    private PerformanceService $performanceService;

    public function __construct(OutputService $outputService, PerformanceService $performanceService)
    {
        $this->outputService = $outputService;
        $this->performanceService = $performanceService;
    }

    public function index()
    {
        return Inertia::render('output');
    }

    public function performance()
    {
    
        try {
            // Get the current unit from session
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return redirect()->route('unit.select');
            }

            // Get the selected unit information
            $selectedUnitInfo = Unit::find($selectedUnit);
            
            // Get performances for the selected unit with unit information
            $performances = Performance::forUnit($selectedUnit)
                ->has('outputs')
                ->with('unit')
                ->orderBy('date_perfomance', 'desc')
                ->orderBy('perf_id', 'desc')
                ->get()
                ->map(function ($performance) {
                    return [
                        'id' => $performance->perf_id,
                        'description' => $performance->description,
                        'date_perfomance' => $performance->date_perfomance ? 
                            (is_string($performance->date_perfomance) ? $performance->date_perfomance : $performance->date_perfomance->format('Y-m-d')) : null,
                        'date_created' => $performance->date_created ? $performance->date_created->format('Y-m-d H:i:s') : null,
                        'status' => $performance->status_text,
                        'unit_id' => $performance->unit_id,
                        'unit_name' => $performance->unit ? $performance->unit->unit_name : 'Unknown Unit',
                        'type' => $performance->type,
                        'weight' => $performance->weight,
                    ];
                });

            Log::info('Performance list loaded', [
                'unit_id' => $selectedUnit,
                'performance_count' => $performances->count()
            ]);

            return Inertia::render('performance-output', [
                'performances' => $performances,
                'selectedUnit' => $selectedUnit,
                'selectedUnitName' => $selectedUnitInfo ? $selectedUnitInfo->unit_name : 'Unknown Unit',
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading performance list', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('performance-output', [
                'performances' => [],
                'selectedUnit' => $selectedUnit ?? null,
                'error' => 'Failed to load performance data'
            ]);
        }
    }

    public function getOutputData(Request $request)
    {
        try {
            $selectedUnit = session('selected_unit');
            if (!$selectedUnit) {
                return response()->json(['error' => 'No unit selected'], 400);
            }

            // Allow explicit perf_id override via query param
            $performance = Performance::forUnit($selectedUnit)
                ->when($request->input('perf_id'), function ($query, $perfId){
                    $query->where('perf_id', $perfId);
                })
                ->orderBy('date_created', 'desc')
                ->first();

            if (!$performance) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'pagination' => [
                        'current_page' => 1,
                        'total' => 0,
                        'per_page' => 10,
                        'last_page' => 1,
                        'from' => 0,
                        'to' => 0
                    ],
                    'performance' => null,
                    'filters' => ['search' => $request->input('search')],
                    'sort' => [
                        'field' => 'output_id',
                        'direction' => 'asc'
                    ]
                ]);
            }

            $result = $this->outputService->getFilteredData($request, $performance->perf_id);

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'pagination' => $result['pagination'],
                'performance' => $this->performanceService->formatPerformanceData($performance),
                'filters' => [
                    'search' => $request->input('search'),
                ],
                'sort' => [
                    'field' => $result['sort_field'],
                    'direction' => $result['sort_direction']
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error in getOutputData:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to get output data'], 500);
        }
    }

}
