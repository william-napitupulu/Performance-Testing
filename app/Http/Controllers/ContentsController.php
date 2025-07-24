<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\AppLayout;
class ContentsController extends Controller
{
    public function index()
    {
        return Inertia::render('contents-and-components', [  
            'title' => 'Contents and components',
        ]);
    }
}
