<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefferenceDetail extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tb_refference_detail';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * This table does not have a single primary key, so we're not defining one.
     * Eloquent will still work for relationships and queries.
     */

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reff_id',
        'output_id',
        'value',
    ];

    /**
     * Get the parent reference baseline that this detail belongs to.
     */
    public function refference(): BelongsTo
    {
        // Defines the inverse of the one-to-many relationship.
        return $this->belongsTo(Refference::class, 'reff_id', 'reff_id');
    }

    public function outputTag(): BelongsTo
    {
        // This connects this model to the OutputTag model via the 'output_id' column.
        return $this->belongsTo(OutputTag::class, 'output_id', 'output_id');
    }
}
