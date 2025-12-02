<?php

namespace App\Http\Controllers;

use App\Models\OutputTag;
use App\Models\Trending;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TrendingController extends Controller
{
    public function getTemplates()
    {
        // Eager load tags so the frontend knows the names/units immediately
        $templates = Trending::with('tags')->get();
        
        return response()->json($templates);
    }

    public function getChartData(Request $request)
    {
        $request->validate([
            'template_id' => 'nullable',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date',
            'unit_id'     => 'nullable|integer',
            'tag_status'  => 'nullable|in:active,inactive'
        ]);

        $templateId = $request->template_id;
        $startDate = $request->start_date ?? now()->subDays(90);
        $endDate = $request->end_date ?? now();

        $targetOutputIds = [];
        $inactiveTagsForClient = [];

        if ($request->tag_status === 'inactive') {
            // For inactive, get ALL tags with status != 1, ignoring the template
            $inactiveTagsQuery = OutputTag::where(function ($query) {
                $query->where('status', '!=', 1)
                    ->orWhereNull('status');
            });
            $targetOutputIds = $inactiveTagsQuery->pluck('output_id')->toArray();
            $inactiveTagsForClient = $inactiveTagsQuery->get();
        } else {
            // For active (or default), get tags from the specified template
            $request->validate(['template_id' => 'required']);
            $template = Trending::findOrFail($templateId);
            $tagsQuery = $template->tags();
            $tagsQuery->where('tb_output_tag.status', 1);
            $targetOutputIds = $tagsQuery->pluck('tb_output_tag.output_id')->toArray();
        }

        if (empty($targetOutputIds)) {
            // Still return tags if we're looking for inactive ones, even if there's no performance data
            if ($request->tag_status === 'inactive') return response()->json(['data' => [], 'tags' => $inactiveTagsForClient]);
            return response()->json([]);
        }

        // 2. Query Performance Data
        // We perform a join here to produce the "Flat" structure the React component expects.
        // Structure: { perf_id, date_perfomance, output_id, value }
        
        $query = DB::table('pt.tb_performance as p')
            ->join('pt.tb_output as o', 'p.perf_id', '=', 'o.perf_id')
            ->whereIn('o.output_id', $targetOutputIds)
            ->whereBetween('p.date_perfomance', [$startDate, $endDate])
            ->select([
                'p.perf_id',
                'p.date_perfomance',
                'o.output_id',
                'o.value'
            ]);

        // For active tags, we only want to see valid performance data.
        if ($request->tag_status === 'active') {
            $query->where('p.status', 1);
        }

        if ($request->has('unit_id')) {
            $query->where('p.unit_id', $request->unit_id);
        }

        $data = $query->orderBy('p.date_perfomance', 'asc')->get();

        if ($request->tag_status === 'inactive') {
            return response()->json(['data' => $data, 'tags' => $inactiveTagsForClient]);
        }

        return response()->json($data); // Active response remains the same
    }

    public function index() {
        return Inertia::Render('trend');
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'output_ids' => 'required|array|min:1',
            'output_ids.*' => 'exists:tb_output_tag,output_id',
        ]);

        $unitId = session('selected_unit');
        if (!$unitId) {
            return response()->json(['error' => 'No unit selected'], 400);
        }

        $template = DB::transaction(function () use ($validated, $unitId) {
            $newTemplate = Trending::create([
                'name' => $validated['name'],
                'unit_id' => $unitId,
            ]);

            $newTemplate->tags()->attach($validated['output_ids']);

            return $newTemplate;
        });

        return response()->json($template->load('tags'), 201);
    }

    public function getTags() {
        // Select specific fields to keep payload light
        $tags = OutputTag::select('output_id', 'description', 'satuan', 'max_value', 'status')->get();
        return response()->json($tags);
    }
}
