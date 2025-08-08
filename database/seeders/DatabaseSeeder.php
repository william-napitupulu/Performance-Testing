<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlantSeeder::class,
            JamSeeder::class,
            UnitSeeder::class,
            UserSeeder::class,
            InputGroupSeeder::class,
            ManualInputSeeder::class,
            InputTagSeeder::class,
            PerformanceSeeder::class,
        ]);
    }
}
