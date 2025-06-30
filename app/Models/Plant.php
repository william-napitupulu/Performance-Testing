<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    protected $table = 'tb_im_plants';
    protected $primaryKey = 'f_plant_id';

    protected $fillable = [
        'f_plant_id',
        'f_plant_name'
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'f_plant_id', 'f_plant_id');
    }
} 