<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_user')->insert([
            [
                'id' => '12345',
                'nama' => 'BEJO',
                'kode' => 'ABCDE', // Menggunakan 'kode' sebagai kode
                'password' => '$2y$12$Ld9SBm6wWpT7Z9Nd0Th4X.uCxajYGfL5NNAJAAP/8F/mAgqO1IZVK',
                'plant_id' => 2,
                'unit_id' => '1', // Unit ID placeholder
                'status' => 1, // Menggunakan 'status' sebagai status
                'remember_token' => null,
            ],
            [
                'id' => '7494015JA',
                'nama' => 'BHAKTI PRASTYAWAN',
                'kode' => 'ABCDE',
                'password' => '$2y$12$K8jMmt7/.1uNPsLEXcy8M.bLSry59Tb1ltbaFESiB5o.FZVROo4De',
                'plant_id' => 1,
                'unit_id' => '1',
                'status' => 1,
                'remember_token' => null,
            ],
            [
                'id' => 'IRNANTO',
                'nama' => 'IRNANTO',
                'kode' => 'ABCDE',
                'password' => '$2y$12$K8jMmt7/.1uNPsLEXcy8M.bLSry59Tb1ltbaFESiB5o.FZVROo4De',
                'plant_id' => 1,
                'unit_id' => '1',
                'status' => 1,
                'remember_token' => null,
            ],
        ]);
    }
} 