<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Output extends Model
{
    protected $table = "pt.tb_output";

    protected $primaryKey = "output_id";

    protected $fillable = [
        'perf_id',
        'output_id',
        'value',
        'unit_id'
    ];

    protected $casts = [
        'perf_id' => 'integer',
        'output_id' => 'integer',
        'unit_id' => 'integer',
    ];
}
