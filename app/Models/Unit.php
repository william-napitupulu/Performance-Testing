<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'tb_unit';

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'unit_id';

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'unit_id',
        'unit_name',
        'status',
        'plant_id',
        'tab_manual_aktif',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'unit_id' => 'integer',
            'status' => 'integer',
            'plant_id' => 'integer',
            'tab_manual_aktif' => 'integer',
        ];
    }

    /**
     * Scope to get only active units.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    /**
     * Scope to get units by plant.
     */
    public function scopeByPlant($query, $plantId)
    {
        return $query->where('plant_id', $plantId);
    }

    /**
     * Get units available for a specific user.
     */
    public static function getAvailableForUser(User $user)
    {
        if ($user->canAccessAllUnits()) {
            // If plant_id is 1, user can choose any unit
            return self::all();
        } else {
            // Otherwise, only units with status = 1 for their plant
            return self::where('plant_id', $user->plant_id)
                      ->where('status', 1)
                      ->get();
        }
    }

    /**
     * Get the unit's display text for dropdowns.
     */
    public function getDisplayText()
    {
        return $this->unit_name;
    }

    /**
     * Get the active tab count for this unit with fallback
     */
    public function getActiveTabCount(): int
    {
        try {
            // Check if the attribute exists and has a value
            if (isset($this->attributes['tab_manual_aktif']) && $this->attributes['tab_manual_aktif'] !== null) {
                return (int) $this->attributes['tab_manual_aktif'];
            }
            
            // Try to get the value directly
            return (int) ($this->tab_manual_aktif ?? 3);
        } catch (\Exception $e) {
            \Log::warning('Error accessing tab_manual_aktif for unit', [
                'unit_id' => $this->unit_id,
                'error' => $e->getMessage()
            ]);
            return 3; // Default fallback
        }
    }
} 