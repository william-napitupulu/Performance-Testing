<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InputTag extends Model
{
    protected $table = 'tb_input_tag';
    public $timestamps = false;

    protected $fillable = [
        'tag_no',
        'address_no',
        'description',
        'satuan',
        'group_id',
        'unit_id',
        'urutan',
        'cell',
        'm_input',
        'jm_input'
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }
} 