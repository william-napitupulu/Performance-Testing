<?php

namespace App\Http\Controllers;

use App\Models\Refference;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Log;

class BaselineController extends Controller
{
    public function index()
    {
        try {
            $selectedUnit = session('selected_unit');
            if (!$selectedUnit) {
                return redirect()->route('unit.select');
            }

            $selectedUnitInfo = Unit::find($selectedUnit);
            
            // This query is now inside the index() method
            $baselines = Refference::where('unit_id', $selectedUnit)
                ->orderBy('date_created', 'desc')
                ->orderBy('reff_id', 'desc')
                ->get(); // We get the full Eloquent models

            Log::info('Baseline list loaded', [
                'unit_id' => $selectedUnit,
                'baseline_count' => $baselines->count()
            ]);

            return Inertia::render('baseline', [
                'baselines' => $baselines,
                'selectedUnit' => $selectedUnit,
                'selectedUnitName' => $selectedUnitInfo ? $selectedUnitInfo->unit_name : 'Unknown Unit',
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading baseline list', [
                'error' => $e->getMessage()
            ]);

            return Inertia::render('baseline', [
                'baselines' => [],
                'error' => 'Failed to load baseline data.'
            ]);
        }
    }
}
