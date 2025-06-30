<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HashTmUsersPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:hash-tm-passwords {--force : Force the operation without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hash existing plain text passwords in the tb_user table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force')) {
            if (!$this->confirm('This will hash all existing passwords in tb_user table. Are you sure you want to continue?')) {
                $this->info('Operation cancelled.');
                return;
            }
        }

        try {
            // Check if table exists
            $tableExists = DB::select("SHOW TABLES LIKE 'tb_user'");
            if (empty($tableExists)) {
                $this->error('Table tb_user does not exist.');
                return;
            }

            // Get all users from tb_user table
            $users = DB::table('tb_user')->get();
            
            if ($users->isEmpty()) {
                $this->info('No users found in tb_user table.');
                return;
            }

            $count = 0;
            $this->info("Found {$users->count()} users in tb_user table.");

            foreach ($users as $user) {
                // Assuming the password field is named 'f_password' or 'password'
                // You may need to adjust this based on your actual table structure
                $passwordField = null;
                $userArray = (array) $user;
                
                // Check for common password field names
                if (isset($userArray['f_password'])) {
                    $passwordField = 'f_password';
                } elseif (isset($userArray['password'])) {
                    $passwordField = 'password';
                } elseif (isset($userArray['kode'])) {
                    $passwordField = 'kode';
                } else {
                    $userId = isset($user->id) ? $user->id : 'unknown';
                    $this->error("Could not find password field for user ID: {$userId}");
                    continue;
                }

                $currentPassword = $userArray[$passwordField];
                
                // Skip if password is already hashed (bcrypt hashes start with $2y$)
                if (str_starts_with($currentPassword, '$2y$')) {
                    $userId = isset($user->id) ? $user->id : 'unknown';
                    $this->info("Password already hashed for user ID: {$userId}");
                    continue;
                }

                // Hash the password
                $hashedPassword = Hash::make($currentPassword);
                
                // Update the password in database
                $whereId = isset($user->id) ? $user->id : null;
                $updated = DB::table('tb_user')
                    ->where('id', $whereId)
                    ->update([$passwordField => $hashedPassword]);

                if ($updated) {
                    $count++;
                    $userId = isset($user->id) ? $user->id : 'unknown';
                    $this->info("✅ Hashed password for user ID: {$userId}");
                    $this->info("Original: {$currentPassword}");
                    $this->info("Hashed: " . substr($hashedPassword, 0, 30) . "...");
                    
                    // Test the hash immediately
                    if (Hash::check($currentPassword, $hashedPassword)) {
                        $this->info("✅ Hash verification successful");
                    } else {
                        $this->error("❌ Hash verification failed");
                    }
                } else {
                    $userId = isset($user->id) ? $user->id : 'unknown';
                    $this->error("Failed to update password for user ID: {$userId}");
                }
                
                $this->info('---');
            }

            $this->info("Successfully processed {$count} passwords in tb_user table.");

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            $this->error("Please check your database connection and table structure.");
        }
    }
} 