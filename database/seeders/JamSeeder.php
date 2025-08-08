<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('jam')->insert([
            ['n' => 0],
            ['n' => 1],
            ['n' => 2],
            ['n' => 3],
            ['n' => 4],
            ['n' => 5],
            ['n' => 6],
            ['n' => 7],
            ['n' => 8],
            ['n' => 9],
            ['n' => 10],
            ['n' => 11],
            ['n' => 12],
            ['n' => 13],
            ['n' => 14],
            ['n' => 15],
            ['n' => 16],
            ['n' => 17],
            ['n' => 18],
            ['n' => 19],
            ['n' => 20],
            ['n' => 21],
            ['n' => 22],
            ['n' => 23],
        ]);
    }
}
