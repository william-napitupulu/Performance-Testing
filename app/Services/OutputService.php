<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class OutputService
{
    public function getFilteredData(Request $request, int $perfId): array
    {
        $query = DB::table('tb_output as a')
            ->join('tb_output_tag as b', 'a.output_id', '=', 'b.output_id')
            ->select('a.output_id', 'a.value', 'b.description', 'b.satuan')
            ->where('a.perf_id', $perfId)
            ->groupBy('a.output_id', 'a.value', 'b.description', 'b.satuan');

        $query->when($request->filled('search'), function ($q) use ($request) {
            $searchTerm = '%' . $request->search . '%';
            $q->where(function ($subQuery) use ($searchTerm) {
                $subQuery->orWhere('a.output_id', 'like', $searchTerm)
                        ->orWhere('b.description', 'like', $searchTerm)
                        ->orWhere('a.value', 'like', $searchTerm)
                        ->orWhere('b.satuan', 'like', $searchTerm);
            });
        });

        $sortMapping = [
            'output_id' => 'a.output_id',
            'value' => 'a.value',
            'description' => 'b.description',
            'satuan' => 'b.satuan'
        ];

        $sortField = $request->input('sort_field', 'output_id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $actualSortField = $sortMapping[$sortField] ?? 'a.output_id';
        $query->orderBy($actualSortField, $sortDirection);
        $totalCount = $query->count();
        
        $perPage = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1);
        $results = $query->limit($perPage)->offset(($page - 1) * $perPage)->get();
        

        return [
            'data' => $results->map(function ($item, $index) use ($page, $perPage) {
                return [
                    'id' => $item->output_id . '_' . $index,
                    'no' => (($page - 1) * $perPage) + $index + 1,
                    'output_id' => $item->output_id,
                    'description' => $item->description,
                    'value' => (float) $item->value,
                    'satuan' => $item->satuan,
                ];
            })->toArray(),
            'pagination' => [
                'current_page' => $page,
                'total' => $totalCount,
                'per_page' => $perPage,
                'last_page' => $perPage > 0 ? ceil($totalCount / $perPage) : 1,
                'from' => $totalCount > 0 ? (($page - 1) * $perPage) + 1 : 0,
                'to' => min($page * $perPage, $totalCount)
            ],
            'sort_field' => $sortField,
            'sort_direction' => $sortDirection
        ];
    }
}