<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestAuth extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'auth:test {username} {password}';

    /**
     * The console command description.
     */
    protected $description = 'Test authentication with tb_user table using password field';

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
        $this->info("  - Kode: {$user->kode}");
        $this->info("  - Can access all units: " . ($user->canAccessAllUnits() ? 'Yes' : 'No'));
        $this->info("  - Password (password) length: " . strlen($user->password));
        $this->info("  - Auth password: " . strlen($user->getAuthPassword()));

        // Test password status
        $this->info("\n🔒 Testing password status...");
        if (str_starts_with($user->password, '$2y$')) {
            $this->info("  - ✅ Password is properly hashed (bcrypt)");
            
            // Test with a known password (you might need to adjust this)
            $testPassword = $this->ask('Enter the plain text password to test (or press enter to skip)');
            if ($testPassword) {
                $hashCheck = Hash::check($testPassword, $user->password);
                $this->info("  - Hash check result: " . ($hashCheck ? 'PASS' : 'FAIL'));
                
                if ($hashCheck) {
                    $this->info("  - ✅ Password verification successful");
                } else {
                    $this->error("  - ❌ Password verification failed");
                }
            }
        } else {
            $this->warn("  - ⚠️  Password is stored as plain text (should be hashed!)");
        }

        // Test the authentication process
        $this->info("\n🔐 Testing authentication process...");
        $password = $this->ask('Enter password to test authentication');
        
        $credentials = [
            'username' => $username,
            'password' => $password
        ];

        if (Auth::attempt($credentials)) {
            $this->info("✅ Authentication successful!");
            $authenticatedUser = Auth::user();
            $this->info("  - Authenticated user ID: {$authenticatedUser->id}");
            $this->info("  - Authenticated user name: {$authenticatedUser->nama}");
            
            // Test password attribute mapping
            $this->info("  - Password attribute: " . strlen($authenticatedUser->password));
            
            // Test unit access
            $units = $authenticatedUser->getAvailableUnits();
            $this->info("  - Available units: " . $units->count());
            foreach ($units as $unit) {
                $this->info("    - {$unit->unit_name} (ID: {$unit->unit_id}, Plant: {$unit->plant_id})");
            }
            
            Auth::logout();
        } else {
            $this->error("❌ Authentication failed!");
            return 1;
        }

        $this->info("✓ All authentication tests passed!");
        return 0;
    }
} 