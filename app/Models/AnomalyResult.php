<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnomalyResult extends Model
{
    protected $table = 'tb_rb_anomaly_result';
    protected $primaryKey = 'f_int_id';
    public $timestamps = false;

    protected $fillable = [
        'f_int_id',
        'f_title',
        'f_equipment_id',
        'f_unit_id',
        'f_event_id',
        'f_severity_level',
        'f_description',
        'f_created_date',
        'f_is_case'
    ];

    protected $casts = [
        'f_created_date' => 'datetime',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'f_equipment_id', 'f_equipment_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'f_unit_id', 'f_unit_id');
    }

    public function caseMain()
    {
        return $this->belongsTo(CaseMain::class, 'f_event_id', 'f_case_id');
    }
} 