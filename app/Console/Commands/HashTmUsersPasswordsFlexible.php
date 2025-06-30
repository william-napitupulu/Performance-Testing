<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class HashTmUsersPasswordsFlexible extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:hash-tm-passwords-flexible {--force : Force the operation without confirmation} {--dry-run : Show what would be done without making changes}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hash existing plain text passwords in the tb_user table (flexible version)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        
        if (!$this->option('force') && !$isDryRun) {
            if (!$this->confirm('This will hash all existing passwords in tb_user table. Are you sure you want to continue?')) {
                $this->info('Operation cancelled.');
                return;
            }
        }

        if ($isDryRun) {
            $this->info('🔍 DRY RUN MODE - No changes will be made');
        }

        try {
            // Check if table exists
            if (!Schema::hasTable('tb_user')) {
                $this->error('Table tb_user does not exist.');
                return;
            }

            // Get table columns to understand structure
            $columns = Schema::getColumnListing('tb_user');
            $this->info('Table columns: ' . implode(', ', $columns));

            // Try to identify the primary key and password field
            $primaryKey = null;
            $passwordField = null;

            // Common primary key names
            $possiblePrimaryKeys = ['id', 'f_user_id', 'user_id', 'f_id'];
            foreach ($possiblePrimaryKeys as $key) {
                if (in_array($key, $columns)) {
                    $primaryKey = $key;
                    break;
                }
            }

            // Common password field names
            $possiblePasswordFields = ['f_password', 'password', 'user_password', 'kode'];
            foreach ($possiblePasswordFields as $field) {
                if (in_array($field, $columns)) {
                    $passwordField = $field;
                    break;
                }
            }

            if (!$primaryKey) {
                $this->error('Could not identify primary key field. Available columns: ' . implode(', ', $columns));
                return;
            }

            if (!$passwordField) {
                $this->error('Could not identify password field. Available columns: ' . implode(', ', $columns));
                return;
            }

            $this->info("Using primary key: {$primaryKey}");
            $this->info("Using password field: {$passwordField}");

            // Get all users from tb_user table
            $users = DB::table('tb_user')->get();
            
            if ($users->isEmpty()) {
                $this->info('No users found in tb_user table.');
                return;
            }

            $count = 0;
            $alreadyHashed = 0;
            $this->info("Found {$users->count()} users in tb_user table.");
            $this->info('---');

            foreach ($users as $user) {
                $userArray = (array) $user;
                $userId = $userArray[$primaryKey];
                $currentPassword = $userArray[$passwordField];
                
                $this->info("Processing user {$primaryKey}: {$userId}");
                
                // Skip if password is already hashed (bcrypt hashes start with $2y$)
                if (str_starts_with($currentPassword, '$2y$')) {
                    $this->info("✅ Password already hashed for user {$primaryKey}: {$userId}");
                    $alreadyHashed++;
                    $this->info('---');
                    continue;
                }

                $this->info("Current password: {$currentPassword}");

                if ($isDryRun) {
                    $this->info("🔍 DRY RUN: Would hash password for user {$primaryKey}: {$userId}");
                    $count++;
                } else {
                    // Hash the password
                    $hashedPassword = Hash::make($currentPassword);
                    
                    // Update the password in database
                    $updated = DB::table('tb_user')
                        ->where($primaryKey, $userId)
                        ->update([$passwordField => $hashedPassword]);

                    if ($updated) {
                        $count++;
                        $this->info("✅ Hashed password for user {$primaryKey}: {$userId}");
                        $this->info("Hashed: " . substr($hashedPassword, 0, 30) . "...");
                        
                        // Test the hash immediately
                        if (Hash::check($currentPassword, $hashedPassword)) {
                            $this->info("✅ Hash verification successful");
                        } else {
                            $this->error("❌ Hash verification failed");
                        }
                    } else {
                        $this->error("Failed to update password for user {$primaryKey}: {$userId}");
                    }
                }
                
                $this->info('---');
            }

            if ($isDryRun) {
                $this->info("🔍 DRY RUN SUMMARY:");
                $this->info("- Would process {$count} passwords");
                $this->info("- {$alreadyHashed} passwords already hashed");
                $this->info("- Total users: {$users->count()}");
                $this->info("\nRun without --dry-run to actually hash the passwords.");
            } else {
                $this->info("✅ COMPLETED:");
                $this->info("- Successfully processed {$count} passwords in tb_um_users table");
                $this->info("- {$alreadyHashed} passwords were already hashed");
                $this->info("- Total users: {$users->count()}");
            }

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            $this->error("Please check your database connection and table structure.");
            
            // Show more detailed error information
            $this->error("Stack trace:");
            $this->error($e->getTraceAsString());
        }
    }
} 