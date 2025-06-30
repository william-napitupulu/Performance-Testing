<?php

namespace App\Auth;

use App\Models\User;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CustomUserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by their unique identifier.
     *
     * @param  mixed  $identifier
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveById($identifier)
    {
        Log::info('Retrieving user by ID', ['id' => $identifier]);
        
        $user = $this->newModelQuery()->where('id', $identifier)->first();
        
        Log::info('User retrieval result', [
            'found' => $user ? true : false,
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->nama : null
        ]);
        
        return $user;
    }

    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     *
     * @param  mixed  $identifier
     * @param  string  $token
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByToken($identifier, $token)
    {
        Log::info('Retrieving user by token', ['id' => $identifier]);
        
        $user = $this->newModelQuery()
            ->where('id', $identifier)
            ->where('remember_token', $token)
            ->first();
            
        return $user;
    }

    /**
     * Update the "remember me" token for the given user in storage.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  string  $token
     * @return void
     */
    public function updateRememberToken(Authenticatable $user, $token)
    {
        Log::info('Updating remember token', ['user_id' => $user->id]);
        
        $user->setRememberToken($token);
        $user->save();
    }

    /**
     * Retrieve a user by the given credentials.
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        Log::info('Retrieving user by credentials', [
            'username' => $credentials['username'] ?? 'not provided',
            'has_password' => isset($credentials['password'])
        ]);

        if (empty($credentials) || (count($credentials) === 1 && array_key_exists('password', $credentials))) {
            return null;
        }

        // Build the query
        $query = $this->newModelQuery();

        foreach ($credentials as $key => $value) {
            if ($key === 'password') {
                continue;
            }
            
            // Map username to id field
            if ($key === 'username') {
                $query->where('id', $value);
            } else {
                $query->where($key, $value);
            }
        }

        $user = $query->first();
        
        Log::info('User retrieval by credentials result', [
            'found' => $user ? true : false,
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->nama : null,
            'plant_id' => $user ? $user->plant_id : null,
            'status' => $user ? $user->status : null
        ]);

        return $user;
    }

    /**
     * Validate a user against the given credentials.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  array  $credentials
     * @return bool
     */
    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        Log::info('Validating credentials', [
            'user_id' => $user->id,
            'user_name' => $user->nama,
            'provided_password' => $credentials['password'] ?? 'not provided'
        ]);

        $isValid = $user->validatePassword($credentials['password']);
        
        Log::info('Credential validation result', [
            'user_id' => $user->id,
            'valid' => $isValid
        ]);

        return $isValid;
    }

    /**
     * Create a new instance of the model.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function createModel()
    {
        $class = '\\' . ltrim($this->model, '\\');

        return new $class;
    }

    /**
     * Gets the hasher implementation.
     *
     * @return \Illuminate\Contracts\Hashing\Hasher
     */
    public function getHasher()
    {
        return $this->hasher;
    }

    /**
     * Sets the hasher implementation.
     *
     * @param  \Illuminate\Contracts\Hashing\Hasher  $hasher
     * @return $this
     */
    public function setHasher(\Illuminate\Contracts\Hashing\Hasher $hasher)
    {
        $this->hasher = $hasher;

        return $this;
    }
} 