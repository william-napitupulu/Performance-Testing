<?php

namespace App\Http\Controllers;

use App\Models\Performance;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PerformanceController extends Controller
{
    /**
     * Display the performance list page.
     */
    public function index()
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
                    ];
                });

            Log::info('Performance list loaded', [
                'unit_id' => $selectedUnit,
                'performance_count' => $performances->count()
            ]);

            return Inertia::render('performance-list', [
                'performances' => $performances,
                'selectedUnit' => $selectedUnit,
                'selectedUnitName' => $selectedUnitInfo ? $selectedUnitInfo->unit_name : 'Unknown Unit',
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading performance list', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('performance-list', [
                'performances' => [],
                'selectedUnit' => $selectedUnit ?? null,
                'error' => 'Failed to load performance data'
            ]);
        }
    }

    /**
     * Store a new performance record.
     */
    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'date_perfomance' => 'required|date',
            'status' => 'required|in:Editable,Locked',
        ]);

        try {
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return response()->json(['error' => 'No unit selected'], 400);
            }

            $performance = Performance::create([
                'description' => $request->description,
                'date_perfomance' => $request->date_perfomance,
                'date_created' => now(),
                'status' => $request->status === 'Editable' ? Performance::STATUS_EDITABLE : Performance::STATUS_LOCKED,
                'unit_id' => $selectedUnit,
            ]);

            Log::info('Performance record created', [
                'perf_id' => $performance->perf_id,
                'unit_id' => $selectedUnit,
                'description' => $request->description
            ]);

            // Load the unit relationship
            $performance->load('unit');

            return response()->json([
                'success' => true,
                'performance' => [
                    'id' => $performance->perf_id,
                    'description' => $performance->description,
                    'date_perfomance' => $performance->date_perfomance ? 
                        (is_string($performance->date_perfomance) ? $performance->date_perfomance : $performance->date_perfomance->format('Y-m-d')) : null,
                    'date_created' => $performance->date_created->format('Y-m-d H:i:s'),
                    'status' => $performance->status_text,
                    'unit_id' => $performance->unit_id,
                    'unit_name' => $performance->unit ? $performance->unit->unit_name : 'Unknown Unit',
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating performance record', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json(['error' => 'Failed to create performance record'], 500);
        }
    }

    /**
     * Update a performance record.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'date_perfomance' => 'required|date',
            'status' => 'required|in:Editable,Locked',
        ]);

        try {
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return response()->json(['error' => 'No unit selected'], 400);
            }

            $performance = Performance::forUnit($selectedUnit)->findOrFail($id);

            // Only allow editing if status is Editable
            if ($performance->status !== Performance::STATUS_EDITABLE) {
                return response()->json(['error' => 'Cannot edit locked performance record'], 403);
            }

            $performance->update([
                'description' => $request->description,
                'date_perfomance' => $request->date_perfomance,
                'status' => $request->status === 'Editable' ? Performance::STATUS_EDITABLE : Performance::STATUS_LOCKED,
            ]);

            Log::info('Performance record updated', [
                'perf_id' => $performance->perf_id,
                'unit_id' => $selectedUnit,
                'description' => $request->description
            ]);

            // Load the unit relationship
            $performance->load('unit');

            return response()->json([
                'success' => true,
                'performance' => [
                    'id' => $performance->perf_id,
                    'description' => $performance->description,
                    'date_perfomance' => $performance->date_perfomance ? 
                        (is_string($performance->date_perfomance) ? $performance->date_perfomance : $performance->date_perfomance->format('Y-m-d')) : null,
                    'date_created' => $performance->date_created->format('Y-m-d H:i:s'),
                    'status' => $performance->status_text,
                    'unit_id' => $performance->unit_id,
                    'unit_name' => $performance->unit ? $performance->unit->unit_name : 'Unknown Unit',
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating performance record', [
                'perf_id' => $id,
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json(['error' => 'Failed to update performance record'], 500);
        }
    }

    /**
     * Delete a performance record.
     */
    public function destroy($id)
    {
        try {
            $selectedUnit = session('selected_unit');
            
            if (!$selectedUnit) {
                return response()->json(['error' => 'No unit selected'], 400);
            }

            $performance = Performance::forUnit($selectedUnit)->findOrFail($id);

            // Only allow deleting if status is Editable
            if ($performance->status !== Performance::STATUS_EDITABLE) {
                return response()->json(['error' => 'Cannot delete locked performance record'], 403);
            }

            $performance->delete();

            Log::info('Performance record deleted', [
                'perf_id' => $id,
                'unit_id' => $selectedUnit
            ]);

            return response()->json(['success' => true]);

        } catch (\Exception $e) {
            Log::error('Error deleting performance record', [
                'perf_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json(['error' => 'Failed to delete performance record'], 500);
        }
    }
} 