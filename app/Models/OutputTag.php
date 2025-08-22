<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutputTag extends Model
{
    protected $table = 'tb_output_tag';

    protected $primaryKey = 'output_id';

    protected $fillable = [
        'output_id',
        'description',
        'satuan',
        'unit_id'
    ];
}
