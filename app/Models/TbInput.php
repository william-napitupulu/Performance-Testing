<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TbInput extends Model
{
    protected $table = 'tb_input';
    
    // Since the table doesn't follow Laravel's naming convention for timestamps
    public $timestamps = false;
    
    protected $fillable = [
        'tag_no',
        'value', 
        'date_rec',
        'perf_id'
    ];
    
    protected $casts = [
        'date_rec' => 'datetime',
        'value' => 'decimal:2'
    ];
} 