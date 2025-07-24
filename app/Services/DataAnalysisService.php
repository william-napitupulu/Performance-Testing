<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Performance;

class DataAnalysisService
{
    /** @var array Validation rules for getData request */
    private array $getDataRules = [
        'description' => 'required|string|max:255',
        'dateTime' => 'required|date',
        'type' => 'required|string|in:Rutin,Sebelum OH,Paska OH,Puslitbang',
        'weight' => 'required|string|in:Beban 1,Beban 2,Beban 3',
        'page' => 'integer|min:1',
        'per_page' => 'integer|min:1|max:999999',
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
     * Get validation rules
     */
    public function getValidationRules(): array
    {
        return $this->getDataRules;
    }

    /**
     * Get filtered and paginated data
     */
    public function getFilteredData(Request $request, int $perfId): array
    {
        // Your query adapted for Laravel's strict MySQL mode
        $baseQuery = "
            SELECT a.tag_no,a.description, min(b.value) as min_value,
            MAX(b.value) as max_value,round(AVG(b.value),2) as avg_value ,a.satuan 
            FROM tb_input_tag a, tb_input b
            WHERE b.tag_no=a.tag_no
            AND b.perf_id= ?
            GROUP BY a.tag_no,a.description,a.satuan
            ORDER BY a.group_id, a.urutan
        ";

        $params = [$perfId];
        $whereConditions = [];

        Log::info('Getting filtered data for perf_id', [
            'perf_id' => $perfId,
            'base_query' => $baseQuery
        ]);

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
            $baseQuery = str_replace("ORDER BY", "AND " . implode(" AND ", $whereConditions) . " ORDER BY", $baseQuery);
        }

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
            $baseQuery = str_replace("ORDER BY", "HAVING " . implode(" AND ", $havingConditions) . " ORDER BY", $baseQuery);
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
        $orderBy = "ORDER BY {$actualSortField} {$sortDirection}";
        
        // Add secondary sort for consistency
        if ($actualSortField !== 'a.urutan') {
            $orderBy .= ", a.urutan ASC";
        }
        
        // Replace the ORDER BY in the query
        $baseQuery = str_replace("ORDER BY a.group_id, a.urutan", $orderBy, $baseQuery);

        // Get total count for pagination - need to use subquery for HAVING
        $countQuery = "
            SELECT COUNT(*) as total FROM (
                SELECT a.tag_no
                FROM tb_input_tag a, tb_input b
                WHERE b.tag_no = a.tag_no AND b.perf_id = ?
        ";
        
        $countParams = [$perfId];
        if (!empty($whereConditions)) {
            $countQuery .= " AND " . implode(" AND ", $whereConditions);
            // Add the WHERE condition parameters
            $whereParamsCount = count($whereConditions);
            $countParams = array_merge($countParams, array_slice($params, 1, $whereParamsCount));
        }
        
        $countQuery .= " GROUP BY a.tag_no, a.description, a.satuan";
        
        if (!empty($havingConditions)) {
            $countQuery .= " HAVING " . implode(" AND ", $havingConditions);
            // Add the HAVING condition parameters
            $havingParamsStart = 1 + count($whereConditions);
            $havingParamsCount = count($havingConditions);
            $countParams = array_merge($countParams, array_slice($params, $havingParamsStart, $havingParamsCount));
        }
        
        $countQuery .= ") as subquery";
        
        $totalCount = DB::select($countQuery, $countParams)[0]->total ?? 0;

        // Paginate - use per_page from request, default to 10
        $perPage = $request->per_page ?: 10;
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

        // Check for duplicate tag_no values
        $tagNumbers = array_map(function($item) { return $item->tag_no; }, $results);
        $duplicateTags = array_filter(array_count_values($tagNumbers), function($count) { return $count > 1; });
        
        if (!empty($duplicateTags)) {
            Log::warning('🔴 DUPLICATE TAG_NO VALUES DETECTED IN API RESPONSE', [
                'perf_id' => $perfId,
                'duplicates' => $duplicateTags,
                'total_results' => count($results),
                'query' => $baseQuery,
                'params' => $params
            ]);
        }

        Log::info('Query results debug', [
            'results_count' => count($results),
            'expected_per_page' => $perPage,
            'page' => $page,
            'total_count' => $totalCount,
            'unique_tags' => count(array_unique($tagNumbers)),
            'has_duplicates' => !empty($duplicateTags)
        ]);

        // Get InputTag data for group_id and urutan mapping
        $tagNos = array_column($results, 'tag_no');
        $inputTags = [];
        if (!empty($tagNos)) {
            $tagData = DB::table('tb_input_tag')
                ->whereIn('tag_no', $tagNos)
                ->get(['tag_no', 'group_id', 'urutan'])
                ->keyBy('tag_no');
            $inputTags = $tagData->toArray();
        }

        return [
            'data' => collect($results)->map(function($item, $index) use ($page, $perPage, $inputTags) {
                    $tagInfo = $inputTags[$item->tag_no] ?? null;
                    return [
                        'id' => $item->tag_no . '_' . $index, // Create unique ID for React keys
                        'no' => (($page - 1) * $perPage) + $index + 1,
                        'tag_no' => $item->tag_no,
                        'description' => $item->description,
                        'min' => (float) $item->min_value,
                        'max' => (float) $item->max_value,
                        'average' => (float) $item->avg_value,
                        'unit_name' => $item->satuan,
                        'group_id' => $tagInfo ? $tagInfo->group_id : 0,
                        'urutan' => $tagInfo ? $tagInfo->urutan : 0
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
}