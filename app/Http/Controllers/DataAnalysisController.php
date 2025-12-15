<?php

namespace App\Http\Controllers;

use App\Jobs\RunExcelAnalysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;
use App\Models\Performance;
use App\Services\DataAnalysisService;
use App\Services\PerformanceService;
use App\Services\InputTagService;
use App\Services\ExportService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class DataAnalysisController extends Controller
{
    private DataAnalysisService $dataAnalysisService;
    private PerformanceService $performanceService;
    private InputTagService $inputTagService;
    private ExportService $exportService;

    public function __construct(
        DataAnalysisService $dataAnalysisService,
        PerformanceService $performanceService,
        InputTagService $inputTagService,
        ExportService $exportService
    ) {
        $this->dataAnalysisService = $dataAnalysisService;
        $this->performanceService = $performanceService;
        $this->inputTagService = $inputTagService;
        $this->exportService = $exportService;
    }

    /**
     * Display the data analysis page
     */
    public function index()
    {
        return Inertia::render('data-analysis');
    }

    /**
     * Get analysis data by calling external API and querying tb_input table
     */
    public function getData(Request $request)
    {
        try {
            // Log request info
            Log::info('getData method called', [
                'user_id' => auth()->user()->id ?? 'No user',
                'request_data' => $request->all(),
                'method' => $request->method(),
                'url' => $request->fullUrl()
            ]);

            // Validate request
            $validator = Validator::make($request->all(), $this->dataAnalysisService->getValidationRules());
            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            // Get selected unit
            $selectedUnit = session('selected_unit');
            Log::info('Selected unit from session', [
                'selected_unit' => $selectedUnit,
                'session_data' => session()->all()
            ]);
            
            if (!$selectedUnit) {
                return response()->json([
                    'success' => false,
                    'message' => 'No unit selected. Please select a unit first.',
                    'data' => []
                ], 400);
            }

            // Create performance record
            $performance = $this->performanceService->createPerformanceRecord($request, $selectedUnit);

            // Call to external API - with error handling
            try {
                $apiResponse = $this->performanceService->callExternalApi($performance->perf_id, $request->dateTime);
                Log::info('External API call successful', [
                    'perf_id' => $performance->perf_id,
                    'response_length' => count($apiResponse)
                ]);
            } catch (\Exception $apiError) {
                Log::warning('External API call failed, continuing with database data only', [
                    'perf_id' => $performance->perf_id,
                    'api_error' => $apiError->getMessage()
                ]);
                // Continue execution - we'll still return the database data
            }

            // Get filtered and paginated data
            Log::info('About to get filtered data', [
                'perf_id' => $performance->perf_id,
                'performance' => $performance->toArray()
            ]);
            
            $result = $this->dataAnalysisService->getFilteredData($request, $performance->perf_id);
            
            Log::info('Filtered data result', [
                'data_count' => count($result['data']),
                'total' => $result['pagination']['total'] ?? 0
            ]);

        
            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'perf_id' => $performance->perf_id,
                'dateTime' => $request->dateTime,
                'performance' => $this->performanceService->formatPerformanceData($performance),
                'pagination' => $result['pagination'],
                'filters' => [
                    'tag_no' => $request->filter_tag_no,
                    'description' => $request->filter_description,
                    'value_min' => $request->filter_value_min,
                    'value_max' => $request->filter_value_max,
                    'min_from' => $request->filter_min_from,
                    'min_to' => $request->filter_min_to,
                    'max_from' => $request->filter_max_from,
                    'max_to' => $request->filter_max_to,
                    'average_from' => $request->filter_average_from,
                    'average_to' => $request->filter_average_to,
                    'date' => $request->filter_date
                ],
                'sort' => [
                    'field' => $result['sort_field'],
                    'direction' => $result['sort_direction']
                ],
                'input_tags' => $this->inputTagService->getInputTagsForTabs(
                    $selectedUnit, 
                    $performance->perf_id, 
                    $this->performanceService->getActiveTabCount()
                ),
                'tab_names' => $this->inputTagService->getTabNames(
                    $selectedUnit, 
                    $this->performanceService->getActiveTabCount()
                )
            ]);

        } catch (ValidationException $e) {
            Log::error('Validation error in getData', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'data' => []
            ], 422);
        } catch (\Exception $e) {
            Log::error('General error in getData', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request',
                'data' => []
            ], 500);
        }
    }

    /**
     * Get input tags for specific parameters
     */
    public function getInputTags(Request $request)
    {
        try {
            // Get unit_id from session
            $unitId = session('selected_unit');
            
            if (!$unitId) {
                Log::warning('No unit selected');
                return response()->json([
                    'success' => false,
                    'message' => 'No unit selected. Please select a unit first.',
                    'input_tags' => []
                ], 400);
            }

            $result = $this->inputTagService->getInputTags($request, $unitId);

            Log::info('Final response data', [
                'success' => true,
                'input_tags_count' => count($result['input_tags']),
                'existing_inputs_count' => count($result['existing_inputs']),
                'datetime' => $result['datetime'],
                'perf_id' => $result['perf_id']
            ]);

            return response()->json([
                'success' => true,
                'input_tags' => $result['input_tags'],
                'existing_inputs' => $result['existing_inputs'],
                'datetime' => $result['datetime'],
                'perf_id' => $result['perf_id']
            ]);

        } catch (ValidationException $e) {
            Log::error('Validation error in getInputTags:', [
                'errors' => $e->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid input parameters',
                'errors' => $e->errors(),
                'input_tags' => []
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in getInputTags:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving input tags',
                'input_tags' => []
            ], 500);
        }
    }

    /**
     * Get analysis data for pagination and filtering
     */
    public function getAnalysisData(Request $request)
    {
        try {
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return response()->json(['error' => 'No unit selected'], 400);
            }

            // Allow explicit perf_id override via query param
            $targetPerfId = $request->input('perf_id');

            $performance = null;
            if ($targetPerfId) {
                $performance = Performance::forUnit($selectedUnit)->where('perf_id', $targetPerfId)->first();
            }

            // Fallback to latest performance record if no perf_id provided or not found
            if (!$performance) {
                $performance = Performance::forUnit($selectedUnit)
                    ->orderBy('date_created', 'desc')
                    ->first();
            }

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
                    'filters' => [
                        'tag_no' => null,
                        'value_min' => null,
                        'value_max' => null,
                        'date' => null
                    ],
                    'sort' => [
                        'field' => 'group_id',
                        'direction' => 'asc'
                    ]
                ]);
            }

            $result = $this->dataAnalysisService->getFilteredData($request, $performance->perf_id);

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'pagination' => $result['pagination'],
                'performance' => $this->performanceService->formatPerformanceData($performance),
                'filters' => [
                    'tag_no' => $request->filter_tag_no,
                    'description' => $request->filter_description,
                    'value_min' => $request->filter_value_min,
                    'value_max' => $request->filter_value_max,
                    'min_from' => $request->filter_min_from,
                    'min_to' => $request->filter_min_to,
                    'max_from' => $request->filter_max_from,
                    'max_to' => $request->filter_max_to,
                    'average_from' => $request->filter_average_from,
                    'average_to' => $request->filter_average_to,
                    'date' => $request->filter_date
                ],
                'sort' => [
                    'field' => $result['sort_field'],
                    'direction' => $result['sort_direction']
                ],
                'input_tags' => $this->inputTagService->getInputTagsForTabs(
                    $selectedUnit, 
                    $performance->perf_id, 
                    $this->performanceService->getActiveTabCount()
                ),
                'tab_names' => $this->inputTagService->getTabNames(
                    $selectedUnit, 
                    $this->performanceService->getActiveTabCount()
                )
            ]);

        } catch (\Exception $e) {
            Log::error('Error in getAnalysisData:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to get analysis data'], 500);
        }
    }

    /**
     * Get all performance records for the current unit
     */
    public function getPerformanceRecords(Request $request)
    {
        try {
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return response()->json([
                    'success' => false,
                    'message' => 'No unit selected. Please select a unit first.',
                    'performances' => []
                ], 400);
            }

            $performances = $this->performanceService->getPerformanceRecords($selectedUnit);

            return response()->json([
                'success' => true,
                'performances' => $performances
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching performance records:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving performance records',
                'performances' => []
            ], 500);
        }
    }

    /**
     * Save manual input data to tb_input table
     */
    public function saveManualInput(Request $request)
    {
        try {
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return response()->json(['error' => 'No unit selected'], 400);
            }

            $request->validate([
                'data' => 'required|array',
                'data.*.tag_no' => 'required|string',
                'data.*.value' => 'nullable|numeric',
                'data.*.date_rec' => 'required|date_format:Y-m-d H:i:s',
                'data.*.perf_id' => 'required|integer'
            ]);

            $result = $this->inputTagService->saveManualInput($request->data);

            Log::info('Manual input data processed', [
                'records_created' => $result['records_created'],
                'records_updated' => $result['records_updated'],
                'total_processed' => $result['total_processed'],
                'unit_id' => $selectedUnit
            ]);

            // Change performance status to editable
            if ($result['total_processed'] > 0 && !empty($request->data[0]['perf_id'])) {
                $perfId = $request->data[0]['perf_id'];
                $performance = Performance::find($perfId);
                if ($performance) {
                    $performance->status = Performance::STATUS_DRAFT;
                    $performance->save();
                    Log::info('Performance status updated to editable', ['perf_id' => $perfId]);
                }
            }

            $message = "Successfully processed {$result['total_processed']} records";
            if ($result['records_created'] > 0 && $result['records_updated'] > 0) {
                $message .= " ({$result['records_created']} created, {$result['records_updated']} updated)";
            } elseif ($result['records_created'] > 0) {
                $message .= " ({$result['records_created']} created)";
            } elseif ($result['records_updated'] > 0) {
                $message .= " ({$result['records_updated']} updated)";
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'records_created' => $result['records_created'],
                'records_updated' => $result['records_updated'],
                'total_processed' => $result['total_processed']
            ]);

        } catch (ValidationException $e) {
            Log::error('Validation error in saveManualInput:', [
                'errors' => $e->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in saveManualInput:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()  
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to save manual input data'
            ], 500);
        }
    }

    /**
     * Export analysis data to Excel
     */
    public function exportAnalysisData(Request $request)
    {
        try {
            // Validate request parameters
            $request->validate([
                'perf_id' => 'nullable|integer|min:1',
                'per_page' => 'nullable|integer|min:1|max:999999',
                'sort_field' => 'nullable|string|in:tag_no,value,min,max,average,description,group_id,urutan',
                'sort_direction' => 'nullable|string|in:asc,desc',
                'filter_tag_no' => 'nullable|string|max:100',
                'filter_description' => 'nullable|string|max:255',
                'filter_value_min' => 'nullable|numeric',
                'filter_value_max' => 'nullable|numeric',
                'filter_min_from' => 'nullable|numeric',
                'filter_min_to' => 'nullable|numeric',
                'filter_max_from' => 'nullable|numeric',
                'filter_max_to' => 'nullable|numeric',
                'filter_average_from' => 'nullable|numeric',
                'filter_average_to' => 'nullable|numeric',
                'filter_date' => 'nullable|date',
            ]);
            
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return response()->json(['error' => 'No unit selected'], 400);
            }

            // Get performance record
            $targetPerfId = $request->input('perf_id');
            $performance = null;
            
            if ($targetPerfId) {
                $performance = Performance::forUnit($selectedUnit)->where('perf_id', $targetPerfId)->first();
            }

            if (!$performance) {
                $performance = Performance::forUnit($selectedUnit)
                    ->orderBy('date_created', 'desc')
                    ->first();
            }

            if (!$performance) {
                return response()->json(['error' => 'No performance data found'], 404);
            }

            // Use the export service
            $this->exportService->exportAnalysisData($request, $performance);
            
            exit; // Required since we're outputting directly

        } catch (\Exception $e) {
            Log::error('Error in exportAnalysisData:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to export analysis data'], 500);
        }
    }

    public function runAnalysis(Performance $performance) {
        $performance->status = Performance::STATUS_PROCESSING;
        $performance->save();

        RunExcelAnalysis::dispatch($performance->perf_id, $performance->unit_id);

        // Redis::publish('analysis-jobs', 'new_job_available');
        return response()->json([
            'message' => 'Analysis queued',
            'perf_id' => $performance->perf_id
        ]);
    }

    public function CheckStatus($id) {
        $performance = Performance::find($id);

        return response()->json([
            'status' => $performance->status,
            'report_filename' => $performance->report_filename
        ]);
    }
}