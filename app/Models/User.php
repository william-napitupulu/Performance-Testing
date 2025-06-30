<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The table associated with the model.
     */
    protected $table = 'tb_user';

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'nama',
        'kode',
        'password',
        'plant_id',
        'status',
        'remember_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'plant_id' => 'integer',
            'status' => 'integer',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the name of the unique identifier for the user.
     */
    public function getAuthIdentifierName()
    {
        return 'id';
    }

    /**
     * Get the unique identifier for the user.
     */
    public function getAuthIdentifier()
    {
        return $this->getAttribute($this->getAuthIdentifierName());
    }

    /**
     * Get the password for the user.
     */
    public function getAuthPassword()
    {
        return $this->password;
    }

    /**
     * Get the name of the password column.
     */
    public function getAuthPasswordName()
    {
        return 'password';
    }

    /**
     * Set the password attribute with automatic hashing.
     */
    public function setPasswordAttribute($value)
    {
        // Only hash if the value is not already hashed
        if (!empty($value) && !str_starts_with($value, '$2y$')) {
            $this->attributes['password'] = Hash::make($value);
            Log::info('Password hashed for user', [
                'user_id' => $this->id ?? 'new_user',
                'original_length' => strlen($value),
                'hashed_length' => strlen($this->attributes['password'])
            ]);
        } else {
            $this->attributes['password'] = $value;
        }
    }

    /**
     * Handle password updates.
     */
    public function updatePassword($password)
    {
        // Hash the password before storing
        if (!empty($password) && !str_starts_with($password, '$2y$')) {
            $this->password = Hash::make($password);
            Log::info('Password updated and hashed for user', [
                'user_id' => $this->id,
                'original_length' => strlen($password),
                'hashed_length' => strlen($this->password)
            ]);
        } else {
            $this->password = $password;
        }
        return $this->save();
    }

    /**
     * Get the token value for the "remember me" session.
     */
    public function getRememberToken()
    {
        return $this->remember_token;
    }

    /**
     * Set the token value for the "remember me" session.
     */
    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }

    /**
     * Get the column name for the "remember me" token.
     */
    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    /**
     * Validate the password against the stored password.
     */
    public function validatePassword($password)
    {
        Log::info('Password validation attempt', [
            'user_id' => $this->id,
            'provided_password_length' => strlen($password),
            'stored_password_length' => strlen($this->password),
            'is_bcrypt_hash' => str_starts_with($this->password, '$2y$')
        ]);

        // Check if password is already hashed (bcrypt)
        if (str_starts_with($this->password, '$2y$')) {
            $isValid = Hash::check($password, $this->password);
            Log::info('Using bcrypt hash verification', [
                'user_id' => $this->id,
                'hash_check_result' => $isValid
            ]);
        } else {
            // Plain text comparison for non-hashed passwords (backward compatibility)
            $isValid = $password === $this->password;
            Log::warning('Using plain text comparison - password should be hashed!', [
                'user_id' => $this->id,
                'plain_text_match' => $isValid
            ]);
        }

        Log::info('Password validation result', [
            'user_id' => $this->id,
            'valid' => $isValid,
            'validation_method' => str_starts_with($this->password, '$2y$') ? 'bcrypt' : 'plain_text'
        ]);

        return $isValid;
    }

    /**
     * Get the user's display name.
     */
    public function getDisplayName()
    {
        return $this->nama;
    }

    /**
     * Check if user can access all units (plant_id = 1).
     */
    public function canAccessAllUnits()
    {
        return $this->plant_id == 1;
    }

    /**
     * Get available units for this user.
     */
    public function getAvailableUnits()
    {
        if ($this->canAccessAllUnits()) {
            // If plant_id is 1, user can choose any unit
            return Unit::all();
        } else {
            // Otherwise, only units with status = 1 for their plant
            return Unit::where('plant_id', $this->plant_id)
                      ->where('status', 1)
                      ->get();
        }
    }

    /**
     * Relationship with Unit model.
     */
    public function units()
    {
        if ($this->canAccessAllUnits()) {
            return Unit::all();
        } else {
            return $this->hasMany(Unit::class, 'plant_id', 'plant_id')
                        ->where('status', 1);
        }
    }
}
