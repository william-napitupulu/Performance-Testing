<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'Please enter your username.',
            'password.required' => 'Please enter your password.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = [
            'username' => $this->input('username'),
            'password' => $this->input('password'),
        ];

        // Log the authentication attempt
        Log::info('Login attempt initiated', [
            'username' => $credentials['username'],
            'ip_address' => $this->ip(),
            'user_agent' => $this->header('User-Agent'),
            'timestamp' => now()->toDateTimeString(),
            'remember_me' => $this->boolean('remember')
        ]);

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            // Log failed authentication
            Log::warning('Login failed - invalid credentials', [
                'username' => $credentials['username'],
                'ip_address' => $this->ip(),
                'user_agent' => $this->header('User-Agent'),
                'timestamp' => now()->toDateTimeString(),
                'throttle_key' => $this->throttleKey(),
                'attempts_remaining' => 5 - RateLimiter::attempts($this->throttleKey())
            ]);

            throw ValidationException::withMessages([
                'username' => 'Username or password is invalid.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());

        // Log successful authentication
        $user = Auth::user();
        Log::info('Login successful', [
            'user_id' => $user->id,
            'username' => $user->id,
            'user_name' => $user->nama,
            'plant_id' => $user->plant_id,
            'status' => $user->status,
            'can_access_all_units' => $user->canAccessAllUnits(),
            'ip_address' => $this->ip(),
            'user_agent' => $this->header('User-Agent'),
            'timestamp' => now()->toDateTimeString(),
            'remember_me' => $this->boolean('remember')
        ]);
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        // Log rate limiting event
        Log::warning('Login rate limited', [
            'username' => $this->input('username'),
            'ip_address' => $this->ip(),
            'user_agent' => $this->header('User-Agent'),
            'throttle_key' => $this->throttleKey(),
            'attempts_count' => RateLimiter::attempts($this->throttleKey()),
            'seconds_remaining' => $seconds,
            'minutes_remaining' => ceil($seconds / 60),
            'timestamp' => now()->toDateTimeString()
        ]);

        throw ValidationException::withMessages([
            'username' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('username')).'|'.$this->ip());
    }
}
