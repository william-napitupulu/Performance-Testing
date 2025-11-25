<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trending extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'pt.tb_trending_template';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'unit_id'
    ];

    /**
     * The tags/parameters included in this trending template.
     * This is a Many-to-Many relationship.
     */
    public function tags()
    {
        return $this->belongsToMany(
            OutputTag::class, 
            'pt.tb_trending_template_detail', // Pivot table name
            'template_id',
            'output_id'
        );
    }
}
