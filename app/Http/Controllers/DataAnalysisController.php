<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\TbInput;
use App\Models\Performance;
use App\Models\InputTag;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class DataAnalysisController extends Controller
{
    /** @var array Validation rules for getData request */
    private array $getDataRules = [
        'description' => 'required|string|max:255',
        'dateTime' => 'required|date',
        'page' => 'integer|min:1',
        'per_page' => 'integer|min:1|max:100',
        'sort_field' => 'string|in:tag_no,value,min,max,average,description,group_id,urutan',
        'sort_direction' => 'string|in:asc,desc',
        'filter_tag_no' => 'string|max:100',
        'filter_description' => 'string|max:255',
        'filter_value_min' => 'numeric',
        'filter_value_max' => 'numeric',
        'filter_min_from' => 'numeric',
        'filter_min_to' => 'numeric',
        'filter_max_from' => 'numeric',
        'filter_max_to' => 'numeric',
        'filter_average_from' => 'numeric',
        'filter_average_to' => 'numeric',
        'filter_date_from' => 'date',
        'filter_date_to' => 'date',
        'filter_date' => 'date',
    ];

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
            $validator = Validator::make($request->all(), $this->getDataRules);
            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            // Get selected unit
            $selectedUnit = session('selected_unit');
            if (!$selectedUnit) {
                return response()->json([
                    'success' => false,
                    'message' => 'No unit selected. Please select a unit first.',
                    'data' => []
                ], 400);
            }

            // Create performance record
            $performance = $this->createPerformanceRecord($request, $selectedUnit);

            // Call to external API - with error handling
            try {
                $apiResponse = $this->callExternalApi($performance->perf_id, $request->dateTime);
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
            $result = $this->getFilteredData($request, $performance->perf_id);

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'perf_id' => $performance->perf_id,
                'dateTime' => $request->dateTime,
                'performance' => $this->formatPerformanceData($performance),
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
                'input_tags' => $this->getInputTagsForTabs($selectedUnit, $performance->perf_id)
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
     * Create a new performance record
     */
    private function createPerformanceRecord(Request $request, int $selectedUnit): Performance
    {
        $performance = Performance::create([
            'description' => $request->description,
            'date_perfomance' => $request->dateTime,
            'date_created' => now(),
            'status' => Performance::STATUS_EDITABLE,
            'unit_id' => $selectedUnit,
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
    private function callExternalApi(int $perfId, string $datetime): array
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
     * Get filtered and paginated data
     */
    private function getFilteredData(Request $request, int $perfId): array
    {
        // Use raw SQL query to get min, max, average with proper joins
        $baseQuery = "
            SELECT 
                a.tag_no,
                a.description, 
                MIN(b.value) as min_value,
                MAX(b.value) as max_value,
                ROUND(AVG(b.value), 2) as avg_value,
                a.satuan as unit_name,
                a.group_id,
                a.urutan
            FROM tb_input_tag a 
            INNER JOIN tb_input b ON b.tag_no = a.tag_no 
            WHERE b.perf_id = ?
        ";

        $params = [$perfId];
        $whereConditions = [];

        // Apply filters
        if ($request->filled('filter_tag_no')) {
            $whereConditions[] = "a.tag_no LIKE ?";
            $params[] = '%' . $request->filter_tag_no . '%';
        }
        
        if ($request->filled('filter_description')) {
            $whereConditions[] = "a.description LIKE ?";
            $params[] = '%' . $request->filter_description . '%';
        }
        
        if ($request->filled('filter_value_min')) {
            $whereConditions[] = "b.value >= ?";
            $params[] = $request->filter_value_min;
        }
        
        if ($request->filled('filter_value_max')) {
            $whereConditions[] = "b.value <= ?";
            $params[] = $request->filter_value_max;
        }
        
        if ($request->filled('filter_date')) {
            $whereConditions[] = "DATE(b.date_rec) = ?";
            $params[] = $request->filter_date;
        }

        // Add WHERE conditions if any
        if (!empty($whereConditions)) {
            $baseQuery .= " AND " . implode(" AND ", $whereConditions);
        }

        // Add GROUP BY
        $baseQuery .= " GROUP BY a.tag_no, a.description, a.satuan, a.group_id, a.urutan";

        // Apply HAVING conditions for aggregated values
        $havingConditions = [];
        
        if ($request->filled('filter_min_from')) {
            $havingConditions[] = "MIN(b.value) >= ?";
            $params[] = $request->filter_min_from;
        }
        
        if ($request->filled('filter_min_to')) {
            $havingConditions[] = "MIN(b.value) <= ?";
            $params[] = $request->filter_min_to;
        }
        
        if ($request->filled('filter_max_from')) {
            $havingConditions[] = "MAX(b.value) >= ?";
            $params[] = $request->filter_max_from;
        }
        
        if ($request->filled('filter_max_to')) {
            $havingConditions[] = "MAX(b.value) <= ?";
            $params[] = $request->filter_max_to;
        }
        
        if ($request->filled('filter_average_from')) {
            $havingConditions[] = "AVG(b.value) >= ?";
            $params[] = $request->filter_average_from;
        }
        
        if ($request->filled('filter_average_to')) {
            $havingConditions[] = "AVG(b.value) <= ?";
            $params[] = $request->filter_average_to;
        }

        // Add HAVING clause if needed
        if (!empty($havingConditions)) {
            $baseQuery .= " HAVING " . implode(" AND ", $havingConditions);
        }

        // Apply sorting
        $sortField = $request->sort_field ?: 'group_id';
        $sortDirection = $request->sort_direction ?: 'asc';
        
        // Map sort fields to the correct column names
        $sortMapping = [
            'tag_no' => 'a.tag_no',
            'value' => 'avg_value', // Sort by average value
            'min' => 'min_value',
            'max' => 'max_value',
            'average' => 'avg_value',
            'description' => 'a.description',
            'group_id' => 'a.group_id',
            'urutan' => 'a.urutan'
        ];
        
        $actualSortField = $sortMapping[$sortField] ?? 'a.group_id';
        $baseQuery .= " ORDER BY {$actualSortField} {$sortDirection}";
        
        // Add secondary sort for consistency
        if ($actualSortField !== 'a.urutan') {
            $baseQuery .= ", a.urutan ASC";
        }

        // Get total count for pagination - need to use subquery for HAVING
        $countQuery = "
            SELECT COUNT(*) as total FROM (
                SELECT a.tag_no
                FROM tb_input_tag a 
                INNER JOIN tb_input b ON b.tag_no = a.tag_no 
                WHERE b.perf_id = ?
        ";
        
        $countParams = [$perfId];
        if (!empty($whereConditions)) {
            $countQuery .= " AND " . implode(" AND ", $whereConditions);
            // Add the WHERE condition parameters
            $whereParamsCount = count($whereConditions);
            $countParams = array_merge($countParams, array_slice($params, 1, $whereParamsCount));
        }
        
        $countQuery .= " GROUP BY a.tag_no, a.description, a.satuan, a.group_id, a.urutan";
        
        if (!empty($havingConditions)) {
            $countQuery .= " HAVING " . implode(" AND ", $havingConditions);
            // Add the HAVING condition parameters
            $havingParamsStart = 1 + count($whereConditions);
            $havingParamsCount = count($havingConditions);
            $countParams = array_merge($countParams, array_slice($params, $havingParamsStart, $havingParamsCount));
        }
        
        $countQuery .= ") as subquery";
        
        $totalCount = DB::select($countQuery, $countParams)[0]->total ?? 0;

        // Paginate - fixed to 10 records per page
        $perPage = 10;
        $page = $request->page ?: 1;
        $offset = ($page - 1) * $perPage;
        
        $baseQuery .= " LIMIT {$perPage} OFFSET {$offset}";

        // Log the query for debugging
        Log::info('Pagination query debug', [
            'perf_id' => $perfId,
            'page' => $page,
            'per_page' => $perPage,
            'offset' => $offset,
            'total_count' => $totalCount,
            'query' => $baseQuery,
            'params' => $params
        ]);

        // Execute the main query
        $results = DB::select($baseQuery, $params);

        Log::info('Query results debug', [
            'results_count' => count($results),
            'expected_per_page' => $perPage,
            'page' => $page,
            'total_count' => $totalCount
        ]);

        return [
            'data' => collect($results)->map(function($item, $index) use ($page, $perPage) {
                return [
                    'id' => $item->tag_no, // Use tag_no as unique identifier
                    'no' => (($page - 1) * $perPage) + $index + 1,
                    'tag_no' => $item->tag_no,
                    'description' => $item->description,
                    'min' => (float) $item->min_value,
                    'max' => (float) $item->max_value,
                    'average' => (float) $item->avg_value,
                    'unit_name' => $item->unit_name,
                    'group_id' => $item->group_id,
                    'urutan' => $item->urutan
                ];
            })->toArray(),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $totalCount,
                'last_page' => ceil($totalCount / $perPage),
                'from' => $totalCount > 0 ? (($page - 1) * $perPage) + 1 : 0,
                'to' => min($page * $perPage, $totalCount)
            ],
            'sort_field' => $request->sort_field ?: 'group_id',
            'sort_direction' => $sortDirection
        ];
    }

    /**
     * Format performance data for response
     */
    private function formatPerformanceData(Performance $performance): array
    {
        return [
            'id' => $performance->perf_id,
            'description' => $performance->description,
            'date_perfomance' => $performance->date_perfomance ? 
                (is_string($performance->date_perfomance) ? $performance->date_perfomance : $performance->date_perfomance->format('Y-m-d H:i:s')) : null,
            'date_created' => $performance->date_created->format('Y-m-d H:i:s'),
            'status' => $performance->status_text,
            'unit_id' => $performance->unit_id,
            'unit_name' => $performance->unit?->unit_name ?? 'Unknown Unit',
        ];
    }

    /**
     * Get input tags for all tabs (Tab1, Tab2, Tab3)
     */
    private function getInputTagsForTabs(int $unitId, int $perfId): array
    {
        try {
            // Get input tags for different m_input values
            $inputTagsTab1 = InputTag::where('unit_id', $unitId)
                ->where('m_input', 1)
                ->orderBy('urutan', 'asc')
                ->orderBy('tag_no', 'asc')
                ->get();

            $inputTagsTab2 = InputTag::where('unit_id', $unitId)
                ->where('m_input', 2)
                ->orderBy('urutan', 'asc')
                ->orderBy('tag_no', 'asc')
                ->get();

            $inputTagsTab3 = InputTag::where('unit_id', $unitId)
                ->where('m_input', 3)
                ->orderBy('urutan', 'asc')
                ->orderBy('tag_no', 'asc')
                ->get();

            // Get existing manual input data for all tabs
            $allTagNos = collect()
                ->merge($inputTagsTab1->pluck('tag_no'))
                ->merge($inputTagsTab2->pluck('tag_no'))
                ->merge($inputTagsTab3->pluck('tag_no'))
                ->unique()
                ->values();

            $existingInputs = [];
            if ($allTagNos->count() > 0) {
                $existingRecords = TbInput::where('perf_id', $perfId)
                    ->whereIn('tag_no', $allTagNos)
                    ->get();
                
                // Organize existing data by tag_no and date_rec for easy lookup
                foreach ($existingRecords as $record) {
                    $key = $record->tag_no . '_' . $record->date_rec;
                    $existingInputs[$key] = [
                        'tag_no' => $record->tag_no,
                        'value' => $record->value,
                        'date_rec' => $record->date_rec,
                    ];
                }
            }

            // Transform tags for each tab
            $transformTags = function($tags) {
                return $tags->map(function($tag) {
                    return [
                        'tag_no' => $tag->tag_no,
                        'description' => $tag->description,
                        'unit_name' => $tag->satuan,
                        'jm_input' => $tag->jm_input,
                        'group_id' => $tag->group_id,
                        'urutan' => $tag->urutan,
                        'm_input' => $tag->m_input
                    ];
                });
            };

            return [
                'tab1' => [
                    'input_tags' => $transformTags($inputTagsTab1),
                    'existing_inputs' => $existingInputs
                ],
                'tab2' => [
                    'input_tags' => $transformTags($inputTagsTab2),
                    'existing_inputs' => $existingInputs
                ],
                'tab3' => [
                    'input_tags' => $transformTags($inputTagsTab3),
                    'existing_inputs' => $existingInputs
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error fetching input tags for tabs:', [
                'unit_id' => $unitId,
                'perf_id' => $perfId,
                'error' => $e->getMessage()
            ]);
            return [
                'tab1' => ['input_tags' => [], 'existing_inputs' => []],
                'tab2' => ['input_tags' => [], 'existing_inputs' => []],
                'tab3' => ['input_tags' => [], 'existing_inputs' => []]
            ];
        }
    }

    public function getInputTags(Request $request)
    {
        try {
            // Get unit_id from session
            $unitId = session('selected_unit');
            
            if (!$unitId) {
                \Log::warning('No unit selected');
                return response()->json([
                    'success' => false,
                    'message' => 'No unit selected. Please select a unit first.',
                    'input_tags' => []
                ], 400);
            }

            // Datetime is optional - only used for frontend time calculations
            $datetime = $request->input('datetime');
            $perfId = $request->input('perf_id'); // Get perf_id to fetch existing manual inputs
            $mInput = $request->input('m_input'); // No default value

            \Log::info('Fetching input tags', [
                'unit_id' => $unitId,
                'datetime' => $datetime,
                'perf_id' => $perfId,
                'm_input' => $mInput
            ]);

            // Get input tags for the unit with specified m_input value
            $query = InputTag::where('unit_id', $unitId);
            
            if ($mInput !== null) {
                $query->where('m_input', $mInput);
            }
            
            $inputTags = $query->orderBy('urutan', 'asc')  // Order by urutan for consistent display
                ->orderBy('tag_no', 'asc')   // Then by tag_no as secondary sort
                ->get();

            \Log::info('Query completed', [
                'found_records' => $inputTags->count(),
                'first_record' => $inputTags->first(),
                'm_input' => $mInput,
                'sql' => InputTag::where('unit_id', $unitId)
                    ->where('m_input', $mInput)
                    ->orderBy('urutan', 'asc')
                    ->orderBy('tag_no', 'asc')
                    ->toSql()
            ]);

            \Log::info('Input tags fetched successfully', [
                'total_records' => $inputTags->count(),
                'unit_id' => $unitId
            ]);

            // Get existing manual input data if perf_id is provided
            $existingInputs = [];
            if ($perfId) {
                $tagNos = $inputTags->pluck('tag_no');
                $existingRecords = TbInput::where('perf_id', $perfId)
                    ->whereIn('tag_no', $tagNos)
                    ->get();
                
                // Organize existing data by tag_no and date_rec for easy lookup
                foreach ($existingRecords as $record) {
                    $key = $record->tag_no . '_' . $record->date_rec;
                    $existingInputs[$key] = [
                        'tag_no' => $record->tag_no,
                        'value' => $record->value,
                        'date_rec' => $record->date_rec,
                    ];
                }
                
                \Log::info('Existing manual inputs found', [
                    'perf_id' => $perfId,
                    'existing_records_count' => $existingRecords->count(),
                    'organized_inputs' => count($existingInputs)
                ]);
            }

            // Transform and log each tag for debugging
            $transformedTags = $inputTags->map(function($tag, $index) {
                $transformed = [
                    'tag_no' => $tag->tag_no,
                    'description' => $tag->description,
                    'unit_name' => $tag->satuan,
                    'jm_input' => $tag->jm_input
                ];
                
                \Log::info("Tag #{$index}", [
                    'original' => [
                        'tag_no' => $tag->tag_no,
                        'description' => $tag->description,
                        'satuan' => $tag->satuan,
                        'jm_input' => $tag->jm_input,
                        'address_no' => $tag->address_no,
                        'group_id' => $tag->group_id,
                        'unit_id' => $tag->unit_id,
                        'urutan' => $tag->urutan,
                        'cell' => $tag->cell,
                        'm_input' => $tag->m_input
                    ],
                    'transformed' => $transformed
                ]);
                
                return $transformed;
            });

            \Log::info('Final response data', [
                'success' => true,
                'input_tags_count' => $transformedTags->count(),
                'existing_inputs_count' => count($existingInputs),
                'datetime' => $datetime,
                'perf_id' => $perfId
            ]);

            return response()->json([
                'success' => true,
                'input_tags' => $transformedTags,
                'existing_inputs' => $existingInputs,
                'datetime' => $datetime,
                'perf_id' => $perfId
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in getInputTags:', [
                'errors' => $e->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid input parameters',
                'errors' => $e->errors(),
                'input_tags' => []
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error in getInputTags:', [
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

            $result = $this->getFilteredData($request, $performance->perf_id);

            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'pagination' => $result['pagination'],
                'performance' => $this->formatPerformanceData($performance),
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
                'input_tags' => $this->getInputTagsForTabs($selectedUnit, $performance->perf_id)
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in getAnalysisData:', [
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

            \Log::info('Fetching performance records', [
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

            \Log::info('Performance records fetched successfully', [
                'total_records' => $performances->count(),
                'unit_id' => $selectedUnit
            ]);

            return response()->json([
                'success' => true,
                'performances' => $performances
            ]);

        } catch (\Exception $e) {
            \Log::error('Error fetching performance records:', [
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
                'data.*.value' => 'required|numeric',
                'data.*.date_rec' => 'required|date_format:Y-m-d H:i:s',
                'data.*.perf_id' => 'required|integer'
            ]);

            $savedCount = 0;
            $updatedCount = 0;
            
            foreach ($request->data as $item) {
                // Determine if row exists
                $exists = DB::table('tb_input')->where([
                    'tag_no'   => $item['tag_no'],
                    'date_rec' => $item['date_rec'],
                    'perf_id'  => $item['perf_id'],
                ])->exists();

                // Always insert or update value (upsert)
                DB::table('tb_input')->updateOrInsert(
                    [
                        'tag_no'   => $item['tag_no'],
                        'date_rec' => $item['date_rec'],
                        'perf_id'  => $item['perf_id'],
                    ],
                    ['value' => $item['value']]
                );

                if ($exists) {
                    $updatedCount++;
                    \Log::info('Updated existing manual input record', $item);
                } else {
                $savedCount++;
                    \Log::info('Created new manual input record', $item);
                }
            }

            \Log::info('Manual input data processed', [
                'records_created' => $savedCount,
                'records_updated' => $updatedCount,
                'total_processed' => $savedCount + $updatedCount,
                'unit_id' => $selectedUnit
            ]);

            $totalProcessed = $savedCount + $updatedCount;
            $message = "Successfully processed {$totalProcessed} records";
            if ($savedCount > 0 && $updatedCount > 0) {
                $message .= " ({$savedCount} created, {$updatedCount} updated)";
            } elseif ($savedCount > 0) {
                $message .= " ({$savedCount} created)";
            } elseif ($updatedCount > 0) {
                $message .= " ({$updatedCount} updated)";
            }

        return response()->json([
            'success' => true,
                'message' => $message,
                'records_created' => $savedCount,
                'records_updated' => $updatedCount,
                'total_processed' => $totalProcessed
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error in saveManualInput:', [
                'errors' => $e->errors()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid input data',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error in saveManualInput:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to save manual input data'
            ], 500);
        }
    }
} 