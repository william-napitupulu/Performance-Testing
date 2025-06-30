<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AnomalyController extends Controller
{
    public function index()
    {
        // Simple controller for performance testing
        // Returns basic anomaly detection page with placeholder data
        return Inertia::render('anomaly-detection', [
            'anomalies' => [],
            'currentPlant' => null,
            'currentUnit' => null,
            'plantUnitDisplay' => 'Performance Testing Environment',
            'totalAnomalies' => 0,
        ]);
    }
} 