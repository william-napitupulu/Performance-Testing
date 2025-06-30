<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class HashExistingPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:hash-passwords {--force : Force the operation without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hash existing plain text passwords in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('force')) {
            if (!$this->confirm('This will hash all existing passwords. Are you sure you want to continue?')) {
                $this->info('Operation cancelled.');
                return;
            }
        }

        $users = User::all();
        $count = 0;

        foreach ($users as $user) {
            $this->info("Processing user: {$user->f_user_name}");
            $this->info("Current password: {$user->f_password}");
            
            // Check if password is already hashed (bcrypt hashes start with $2y$)
            if (!str_starts_with($user->f_password, '$2y$')) {
                $originalPassword = $user->f_password;
                $hashedPassword = Hash::make($user->f_password);
                
                $user->f_password = $hashedPassword;
                $user->save();
                
                $count++;
                $this->info("Hashed password for user: {$user->f_user_name}");
                $this->info("Original: {$originalPassword}");
                $this->info("Hashed: " . substr($hashedPassword, 0, 30) . "...");
                
                // Test the hash immediately
                if (Hash::check($originalPassword, $hashedPassword)) {
                    $this->info("✅ Hash verification successful for {$user->f_user_name}");
                } else {
                    $this->error("❌ Hash verification failed for {$user->f_user_name}");
                }
            } else {
                $this->info("Password already hashed for user: {$user->f_user_name}");
            }
        }

        $this->info("Successfully processed {$count} passwords.");
    }
}
