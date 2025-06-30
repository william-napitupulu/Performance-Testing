<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $table = 'tb_im_equipments';
    protected $primaryKey = 'f_equipment_id';
    public $timestamps = false;

    protected $fillable = [
        'f_equipment_id',
        'f_equipment_name',
        'f_unit_id'
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'f_unit_id', 'f_unit_id');
    }

    public function anomalyResults()
    {
        return $this->hasMany(AnomalyResult::class, 'f_equipment_id', 'f_equipment_id');
    }
} 