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
        'date_created',
        'is_default',
        'perf_id'
    ];

    public function details(): HasMany
    {
        // Defines a one-to-many relationship with the RefferenceDetail model.
        // We specify the foreign key and local key because they don't follow Laravel's conventions.
        return $this->hasMany(RefferenceDetail::class, 'reff_id', 'reff_id');
    }

    /**
     * Get the unit that owns the performance record.
     */
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'unit_id');
    }

    /**
     * Scope to get performances for a specific unit.
     */
    public function scopeForUnit($query, $unitId)
    {
        return $query->where('unit_id', $unitId);
    }
}
