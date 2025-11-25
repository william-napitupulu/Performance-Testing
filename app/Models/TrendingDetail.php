<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrendingDetail extends Model
{
    protected $table = 'pt.tb_trending_template_detail';

    protected $fillable = [
        'template_id',
        'output_id'
    ];
}
