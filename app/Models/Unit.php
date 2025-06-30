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
} 