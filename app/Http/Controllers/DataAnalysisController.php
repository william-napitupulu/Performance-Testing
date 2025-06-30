<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DataAnalysisController extends Controller
{
    /**
     * Display the data analysis page
     */
    public function index()
    {
        return Inertia::render('data-analysis');
    }

    /**
     * Get analysis data based on description and datetime
     */
    public function getData(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:500',
            'datetime' => 'required|date',
        ]);

        // Mock data - in real application, this would query your database
        $analysisData = [
            [
                'id' => 1,
                'no' => 1,
                'parameter' => 'Steam Temperature',
                'uom' => '°C',
                'reference_data' => 450.5,
                'existing_data' => 445.2,
                'gap' => -5.3
            ],
            [
                'id' => 2,
                'no' => 2,
                'parameter' => 'Pressure Level',
                'uom' => 'MPa',
                'reference_data' => 12.5,
                'existing_data' => 12.8,
                'gap' => 0.3
            ],
            [
                'id' => 3,
                'no' => 3,
                'parameter' => 'Flow Rate',
                'uom' => 'm³/h',
                'reference_data' => 1200.0,
                'existing_data' => 1185.5,
                'gap' => -14.5
            ],
            [
                'id' => 4,
                'no' => 4,
                'parameter' => 'Efficiency',
                'uom' => '%',
                'reference_data' => 85.0,
                'existing_data' => 82.3,
                'gap' => -2.7
            ],
            [
                'id' => 5,
                'no' => 5,
                'parameter' => 'Vibration Level',
                'uom' => 'mm/s',
                'reference_data' => 2.5,
                'existing_data' => 3.1,
                'gap' => 0.6
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $analysisData,
            'description' => $request->description,
            'datetime' => $request->datetime,
        ]);
    }
} 