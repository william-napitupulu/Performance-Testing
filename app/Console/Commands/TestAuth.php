<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TestAuth extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'auth:test {username} {password}';

    /**
     * The console command description.
     */
    protected $description = 'Test authentication with tb_user table using kode field';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $username = $this->argument('username');
        $password = $this->argument('password');

        $this->info("Testing authentication for user: {$username}");
        
        // Test database connection
        try {
            DB::connection()->getPdo();
            $this->info("✓ Database connection successful");
        } catch (\Exception $e) {
            $this->error("✗ Database connection failed: " . $e->getMessage());
            return 1;
        }

        // Check if user exists
        $user = User::where('id', $username)->first();
        if (!$user) {
            $this->error("✗ User not found in tb_user table");
            return 1;
        }

        $this->info("✓ User found:");
        $this->info("  - ID: {$user->id}");
        $this->info("  - Name: {$user->nama}");
        $this->info("  - Plant ID: {$user->plant_id}");
        $this->info("  - Status: {$user->status}");
        $this->info("  - Can access all units: " . ($user->canAccessAllUnits() ? 'Yes' : 'No'));
        $this->info("  - Kode (password) length: " . strlen($user->kode));
        $this->info("  - Auth password: " . strlen($user->getAuthPassword()));

        // Test password validation
        $isValid = $user->validatePassword($password);
        if ($isValid) {
            $this->info("✓ Password validation successful");
        } else {
            $this->error("✗ Password validation failed");
            return 1;
        }

        // Test password hashing
        $this->info("Testing password hashing...");
        if (str_starts_with($user->kode, '$2y$')) {
            $this->info("✓ Password is already hashed with bcrypt");
        } else {
            $this->warn("! Password is stored as plain text");
            $this->info("  To hash existing passwords, run: php artisan passwords:hash");
        }

        // Test Auth::attempt
        $credentials = [
            'username' => $username,
            'password' => $password
        ];

        if (Auth::attempt($credentials)) {
            $this->info("✓ Auth::attempt successful");
            $authenticatedUser = Auth::user();
            $this->info("  - Authenticated user ID: {$authenticatedUser->id}");
            $this->info("  - Authenticated user name: {$authenticatedUser->nama}");
            
            // Test password attribute mapping
            $this->info("  - Password attribute: " . (isset($authenticatedUser->password) ? 'Set' : 'Not set'));
            $this->info("  - Kode attribute: " . strlen($authenticatedUser->kode));
            
            // Test unit access
            $units = $authenticatedUser->getAvailableUnits();
            $this->info("  - Available units: " . $units->count());
            foreach ($units as $unit) {
                $this->info("    - {$unit->unit_name} (ID: {$unit->unit_id}, Plant: {$unit->plant_id})");
            }
            
        } else {
            $this->error("✗ Auth::attempt failed");
            return 1;
        }

        $this->info("✓ All authentication tests passed!");
        return 0;
    }
} 