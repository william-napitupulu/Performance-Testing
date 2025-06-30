<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseMain extends Model
{
    protected $table = 'tb_cm_main';
    protected $primaryKey = 'f_case_id';
    public $timestamps = false;

    protected $fillable = [
        'f_case_id',
        'f_status'
    ];

    public function anomalyResults()
    {
        return $this->hasMany(AnomalyResult::class, 'f_event_id', 'f_case_id');
    }
} 