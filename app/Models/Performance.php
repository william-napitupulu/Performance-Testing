<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Performance extends Model
{
    use HasFactory;

    /**
     * The connection name for the model.
     */
    protected $connection = 'mysql';

    /**
     * The table associated with the model.
     */
    protected $table = 'pt.tb_performance';

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'perf_id';

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'description',
        'date_perfomance',
        'date_created',
        'status',
        'unit_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'date_perfomance' => 'date',
        'date_created' => 'datetime',
        'perf_id' => 'integer',
        'unit_id' => 'integer',
        'status' => 'integer',
    ];

    /**
     * Status constants
     */
    const STATUS_LOCKED = 0;
    const STATUS_EDITABLE = 1;

    /**
     * Get the status as a string
     */
    public function getStatusTextAttribute()
    {
        return $this->status === self::STATUS_EDITABLE ? 'Editable' : 'Locked';
    }

    /**
     * Set status from string value
     */
    public function setStatusFromText($statusText)
    {
        $this->status = ($statusText === 'Editable') ? self::STATUS_EDITABLE : self::STATUS_LOCKED;
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

    /**
     * Scope to get performances by status.
     */
    public function scopeByStatus($query, $status)
    {
        // Handle both string and integer status values
        if (is_string($status)) {
            $statusInt = ($status === 'Editable') ? self::STATUS_EDITABLE : self::STATUS_LOCKED;
            return $query->where('status', $statusInt);
        }
        return $query->where('status', $status);
    }

    /**
     * Scope to get performances by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date_perfomance', [$startDate, $endDate]);
    }

    /**
     * Get editable performances.
     */
    public function scopeEditable($query)
    {
        return $query->where('status', self::STATUS_EDITABLE);
    }

    /**
     * Get locked performances.
     */
    public function scopeLocked($query)
    {
        return $query->where('status', self::STATUS_LOCKED);
    }
} 