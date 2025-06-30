<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HashPasswordsCommand extends Command
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

        // Get all users from the database using the correct table name
        $users = DB::table('tb_um_users')->get();

        if ($users->isEmpty()) {
            $this->warn('No users found in the database.');
            return 0;
        }

        $this->info("Found {$users->count()} users to process.");

        $hashedCount = 0;
        $skippedCount = 0;

        foreach ($users as $user) {
            // Check if password is already hashed (Bcrypt hashes start with $2y$)
            if (str_starts_with($user->f_password, '$2y$')) {
                $this->line("User {$user->f_user_name} already has a hashed password. Skipping.");
                $skippedCount++;
                continue;
            }

            // Hash the plain text password
            $hashedPassword = Hash::make($user->f_password);

            // Update the user's password in the database
            DB::table('tb_um_users')
                ->where('f_user_id', $user->f_user_id)
                ->update(['f_password' => $hashedPassword]);

            $this->line("Hashed password for user: {$user->f_user_name}");
            $hashedCount++;
        }

        $this->info("\nPassword hashing completed!");
        $this->info("Hashed: {$hashedCount} passwords");
        $this->info("Skipped: {$skippedCount} passwords (already hashed)");

        return 0;
    }
}
