<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TestUserModel extends Command
{
    protected $signature = 'test:user-model';
    protected $description = 'Test User model configuration';

    public function handle()
    {
        $this->info('Testing User model configuration...');
        
        // Test User model table
        $user = new User();
        $this->info("User model table: " . $user->getTable());
        
        // Check if table exists
        if (Schema::hasTable('tb_user')) {
            $this->info('✓ tb_user table exists');
            
            // Try to count users
            try {
                $count = User::count();
                $this->info("✓ Found {$count} users in tb_user table");
                
                // Show sample users
                $sampleUsers = User::take(3)->get(['id', 'nama', 'plant_id', 'kode']);
                if ($sampleUsers->count() > 0) {
                    $this->info('Sample users:');
                    foreach ($sampleUsers as $user) {
                        $isHashed = str_starts_with($user->kode ?? '', '$2y$') ? 'Hashed' : 'Plain text';
                        $passLength = strlen($user->kode ?? '');
                        $this->info("  - ID: {$user->id}, Name: {$user->nama}, Plant: {$user->plant_id}, Password: {$isHashed} (Length: {$passLength})");
                    }
                }
                
            } catch (\Exception $e) {
                $this->error('Error querying users: ' . $e->getMessage());
            }
            
        } else {
            $this->error('✗ tb_user table does not exist');
        }
        
        // List all tables in database
        $this->info('Available tables in database:');
        $tables = DB::select('SHOW TABLES');
        foreach ($tables as $table) {
            $tableName = array_values((array) $table)[0];
            $this->info("  - {$tableName}");
        }
    }
} 