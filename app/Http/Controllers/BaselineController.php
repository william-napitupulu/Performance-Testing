<?php

namespace App\Http\Controllers;

use App\Models\Refference;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function show(Refference $refference)
    {
        // Eager load the detail records and their associated tags for efficiency
        $refference->load('details.outputTag');

        // The data is now loaded onto the $refference model,
        // so we can pass it directly to the Inertia view.
        return Inertia::render('baseline-details', [
            'baseline' => $refference,
        ]);
    }

    public function setDefault(Refference $refference)
    {
        try {
            DB::transaction(function () use ($refference) {
                // 1. Unset any other default baseline for this unit.
                Refference::where('unit_id', $refference->unit_id)
                          ->where('reff_id', '!=', $refference->reff_id)
                          ->update(['is_default' => 0]);

                // 2. Set the selected baseline as the new default.
                $refference->is_default = 1;
                $refference->save();
            });

            return redirect()->back()->with('success', 'Default baseline has been updated successfully!');
            
        } catch (\Exception $e) {
            Log::error('Failed to set default baseline: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update the default baseline.');
        }
    }

    public function destroy(Refference $refference)
    {
        // Logic to delete a baseline
        $refference->details()->delete(); // Delete all child detail records
        $refference->delete(); // Delete the parent baseline record

        return redirect()->route('baseline.index')->with('success', 'Baseline deleted successfully.');
    }
}
