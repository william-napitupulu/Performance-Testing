<?php

namespace App\Helpers;

class SessionHelper
{
    /**
     * Get the current plant ID from session
     */
    public static function getCurrentPlantId(): ?string
    {
        return session('current_plant_id');
    }

    /**
     * Get the current plant name from session
     */
    public static function getCurrentPlantName(): ?string
    {
        return session('current_plant_name');
    }

    /**
     * Get the current plant information from session
     */
    public static function getCurrentPlant(): ?array
    {
        return session('current_plant');
    }

    /**
     * Get the current unit ID from session
     */
    public static function getCurrentUnitId(): ?string
    {
        return session('current_unit_id');
    }

    /**
     * Get the current unit name from session
     */
    public static function getCurrentUnitName(): ?string
    {
        return session('current_unit_name');
    }

    /**
     * Get the current unit information from session
     */
    public static function getCurrentUnit(): ?array
    {
        return session('current_unit');
    }

    /**
     * Check if user has selected a plant and unit
     */
    public static function hasPlantAndUnit(): bool
    {
        return !empty(session('current_plant_id')) && !empty(session('current_unit_id'));
    }

    /**
     * Get formatted display string for current plant and unit
     */
    public static function getCurrentPlantUnitDisplay(): string
    {
        $plantName = self::getCurrentPlantName();
        $unitName = self::getCurrentUnitName();
        
        if ($plantName && $unitName) {
            return "{$plantName} - {$unitName}";
        }
        
        return 'No Plant/Unit Selected';
    }
} 