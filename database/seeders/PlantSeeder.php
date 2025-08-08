<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_plant')->insert([
            ['plant_id' => 1, 'description' => 'Kantor Pusat', 'status' => 1],
            ['plant_id' => 2, 'description' => 'PLTU Paiton', 'status' => 1],
            ['plant_id' => 3, 'description' => 'PLTU Indramayu', 'status' => 0],
            ['plant_id' => 4, 'description' => 'PLTU Pacitan', 'status' => 0],
            ['plant_id' => 5, 'description' => 'PLTU Paiton #9', 'status' => 0],
            ['plant_id' => 6, 'description' => 'PLTU Tanjung Awar-Awar', 'status' => 0],
            ['plant_id' => 7, 'description' => 'PLTU Rembang', 'status' => 0],
            ['plant_id' => 8, 'description' => 'PLTU Tenayan', 'status' => 0],
            ['plant_id' => 9, 'description' => 'PLTU Kaltim Teluk', 'status' => 0],
            ['plant_id' => 10, 'description' => 'PLTU Pulang Pisau', 'status' => 0],
            ['plant_id' => 11, 'description' => 'PLTA Cirata', 'status' => 0],
            ['plant_id' => 12, 'description' => 'PLTMG Arun', 'status' => 0],
            ['plant_id' => 13, 'description' => 'PLTA Brantas', 'status' => 0],
            ['plant_id' => 14, 'description' => 'PLTMG Bawean', 'status' => 0],
            ['plant_id' => 15, 'description' => 'PLTU Tidore', 'status' => 0],
            ['plant_id' => 16, 'description' => 'PLTA Asahan', 'status' => 0],
            ['plant_id' => 17, 'description' => 'PLTA Batang Toru', 'status' => 0],
            ['plant_id' => 18, 'description' => 'PLTD Suppa', 'status' => 0],
            ['plant_id' => 19, 'description' => 'PLTG Duri', 'status' => 0],
            ['plant_id' => 20, 'description' => 'PLTU Ampana', 'status' => 0],
            ['plant_id' => 21, 'description' => 'PLTU Amurang', 'status' => 0],
            ['plant_id' => 22, 'description' => 'PLTU Tembilahan', 'status' => 0],
            ['plant_id' => 23, 'description' => 'PLTU Talaud', 'status' => 0],
            ['plant_id' => 24, 'description' => 'PLTU S2P Cilacap', 'status' => 0],
            ['plant_id' => 25, 'description' => 'PLTU Ropa', 'status' => 0],
            ['plant_id' => 26, 'description' => 'PLTU Ketapang', 'status' => 0],
            ['plant_id' => 27, 'description' => 'PLTU Jawa 7', 'status' => 0],
            ['plant_id' => 28, 'description' => 'PLTU Kendari', 'status' => 0],
            ['plant_id' => 29, 'description' => 'PLTU Bolok', 'status' => 0],
            ['plant_id' => 30, 'description' => 'PLTU Belitung', 'status' => 0],
            ['plant_id' => 31, 'description' => 'PLTU Bangka', 'status' => 0],
            ['plant_id' => 32, 'description' => 'PLTU Banjarsari', 'status' => 0],
            ['plant_id' => 33, 'description' => 'PLTU Anggrek', 'status' => 0],
            ['plant_id' => 34, 'description' => 'UP Muara Tawar', 'status' => 0],
            ['plant_id' => 35, 'description' => 'UP Muara Karang', 'status' => 0],
            ['plant_id' => 36, 'description' => 'UP Gresik', 'status' => 0],
            ['plant_id' => 37, 'description' => 'PLTU Tarahan', 'status' => 0],
            ['plant_id' => 38, 'description' => 'UP Belawan', 'status' => 0],
            ['plant_id' => 39, 'description' => 'UP Bandar Lampung', 'status' => 0],
            ['plant_id' => 40, 'description' => 'UP Bakaru', 'status' => 0],
            ['plant_id' => 41, 'description' => 'PLTU Sebalang', 'status' => 0],
            ['plant_id' => 42, 'description' => 'UP Punagaya', 'status' => 0],
            ['plant_id' => 43, 'description' => 'UP Minahasa', 'status' => 0],
            ['plant_id' => 44, 'description' => 'UP Pandan', 'status' => 0],
            ['plant_id' => 45, 'description' => 'UP Pekanbaru', 'status' => 0],
            ['plant_id' => 46, 'description' => 'PLTU Nagan Raya', 'status' => 0],
            ['plant_id' => 47, 'description' => 'UP Sengkang', 'status' => 0],
            ['plant_id' => 48, 'description' => 'PLTMG BauBau', 'status' => 0],
            ['plant_id' => 49, 'description' => 'PLTMG Bima', 'status' => 0],
            ['plant_id' => 50, 'description' => 'PLTMG Kendari', 'status' => 0],
        ]);
    }
}
