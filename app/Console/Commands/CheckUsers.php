<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Unit;

class CheckUsers extends Command
{
    protected $signature = 'check:users';
    protected $description = 'Check users and units in PT database';

    public function handle()
    {
        $this->info('=== PT Database Connection Test ===');
        
        try {
            $users = User::all();
            $this->info("Found {$users->count()} users:");
            
            foreach ($users as $user) {
                $this->line("ID: {$user->id} | Name: {$user->nama} | Kode: {$user->kode} | Password: " . (str_starts_with($user->password ?? '', '$2y$') ? 'Hashed (' . strlen($user->password) . ')' : 'Plain (' . strlen($user->password ?? '') . ')') . " | Plant: {$user->plant_id}");
            }
            
            $this->info('');
            
            $units = Unit::where('status', 1)->take(5)->get();
            $this->info("Found {$units->count()} active units (showing first 5):");
            
            foreach ($units as $unit) {
                $this->line("Unit ID: {$unit->unit_id} | Name: {$unit->unit_name} | Plant: {$unit->plant_id}");
            }
            
        } catch (\Exception $e) {
            $this->error('Database connection error: ' . $e->getMessage());
        }
    }
} 