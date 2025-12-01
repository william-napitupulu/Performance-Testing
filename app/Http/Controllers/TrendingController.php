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
            'template_id' => 'required',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date',
            'unit_id'     => 'nullable|integer'
        ]);

        $templateId = $request->template_id;
        $startDate = $request->start_date ?? now()->subDays(90);
        $endDate = $request->end_date ?? now();

        // 1. Get the Tag IDs associated with this template
        $template = Trending::findOrFail($templateId);
        $targetOutputIds = $template->tags->pluck('output_id')->toArray();

        if (empty($targetOutputIds)) {
            return response()->json([]);
        }

        // 2. Query Performance Data
        // We perform a join here to produce the "Flat" structure the React component expects.
        // Structure: { perf_id, date_perfomance, output_id, value }
        
        $query = DB::table('pt.tb_performance as p')
            ->join('pt.tb_output as o', 'p.perf_id', '=', 'o.perf_id')
            ->whereIn('o.output_id', $targetOutputIds)
            ->whereBetween('p.date_perfomance', [$startDate, $endDate])
            ->where('p.status', 1) // Assuming we only want 'Editable' (Valid) data, change logic if needed
            ->select([
                'p.perf_id',
                'p.date_perfomance',
                'o.output_id',
                'o.value'
            ]);

        if ($request->has('unit_id')) {
            $query->where('p.unit_id', $request->unit_id);
        }

        $data = $query->orderBy('p.date_perfomance', 'asc')->get();

        return response()->json($data);
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

        $template = DB::transaction(function () use ($validated) {
            $newTemplate = Trending::create([
                'name' => $validated['name'],
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
