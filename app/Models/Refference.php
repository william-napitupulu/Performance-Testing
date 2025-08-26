<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Refference extends Model
{
    protected $table = 'tb_refference';

    protected $primaryKey = 'reff_id';

    public $timestamps = false;

    protected $fillable = [
        'description',
        'keterangan',
        'unit_id',
        'is_default',
    ];

    public function details(): HasMany
    {
        // Defines a one-to-many relationship with the RefferenceDetail model.
        // We specify the foreign key and local key because they don't follow Laravel's conventions.
        return $this->hasMany(RefferenceDetail::class, 'reff_id', 'reff_id');
    }
}
