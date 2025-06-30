<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TestPageController extends Controller
{
    public function index()
    {
        // Simple controller for performance testing
        // Returns basic anomaly detection page with placeholder data
        return Inertia::render('test-page', [
            'testData' => [],
        ]);
    }   
} 