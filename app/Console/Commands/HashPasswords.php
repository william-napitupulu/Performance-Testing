<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class HashPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'passwords:hash';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hash all existing plain text passwords in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting password hashing process...');
        
        // Check database connection
        try {
            DB::connection()->getPdo();
            $this->info('✓ Database connection successful');
        } catch (\Exception $e) {
            $this->error('✗ Database connection failed: ' . $e->getMessage());
            return 1;
        }

        // Get all users with plain text passwords (not starting with $2y$)
        $allUsers = User::all();
        $users = $allUsers->filter(function($user) {
            return !str_starts_with($user->kode ?? '', '$2y$');
        });
        
        if ($users->count() === 0) {
            $this->info('No users with plain text passwords found. All passwords are already hashed.');
            return 0;
        }

        $this->info("Found {$users->count()} users with plain text passwords:");
        
        // Display users that will be affected
        $this->table(
            ['User ID', 'Name', 'Current Password Length', 'Plant ID'],
            $users->map(function ($user) {
                return [
                    $user->id,
                    $user->nama,
                    strlen($user->kode),
                    $user->plant_id
                ];
            })->toArray()
        );

        if (!$this->confirm('Do you want to hash these passwords?')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        $hashedCount = 0;
        $failedCount = 0;

        $this->info('Starting to hash passwords...');
        $progressBar = $this->output->createProgressBar($users->count());

        foreach ($users as $user) {
            try {
                $originalPassword = $user->kode;
                $hashedPassword = Hash::make($originalPassword);
                
                // Update directly in database to avoid triggering model events
                DB::table('tb_user')
                    ->where('id', $user->id)
                    ->update(['kode' => $hashedPassword]);

                Log::info('Password hashed successfully', [
                    'user_id' => $user->id,
                    'user_name' => $user->nama,
                    'original_length' => strlen($originalPassword),
                    'hashed_length' => strlen($hashedPassword)
                ]);

                $hashedCount++;
                $progressBar->advance();

            } catch (\Exception $e) {
                $this->error("\nFailed to hash password for user {$user->id}: " . $e->getMessage());
                Log::error('Password hashing failed', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage()
                ]);
                $failedCount++;
                $progressBar->advance();
            }
        }

        $progressBar->finish();
        $this->newLine(2);

        $this->info("Password hashing completed!");
        $this->info("✓ Successfully hashed: {$hashedCount} passwords");
        
        if ($failedCount > 0) {
            $this->error("✗ Failed to hash: {$failedCount} passwords");
        }

        $this->info('All operations have been logged to storage/logs/laravel.log');

        return $failedCount > 0 ? 1 : 0;
    }
}
