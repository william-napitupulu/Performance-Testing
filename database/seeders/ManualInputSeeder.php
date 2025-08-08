<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ManualInputSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_manual_input')->insert([
            ['ID' => 1, 'Nama' => 'Coal Flow Input', 'unit_id' => 2, 'tab_num' => 1],
            ['ID' => 2, 'Nama' => 'Electrical Input', 'unit_id' => 2, 'tab_num' => 2],
            ['ID' => 3, 'Nama' => 'Makeup Water Input', 'unit_id' => 2, 'tab_num' => 3],
            ['ID' => 4, 'Nama' => 'Coal Properties Input', 'unit_id' => 2, 'tab_num' => 4],
            ['ID' => 5, 'Nama' => 'Flue Gas Input', 'unit_id' => 2, 'tab_num' => 5],
            ['ID' => 6, 'Nama' => 'Referensi Udara Input', 'unit_id' => 2, 'tab_num' => 6],
            ['ID' => 7, 'Nama' => 'Temperature Input', 'unit_id' => 2, 'tab_num' => 7],
            ['ID' => 8, 'Nama' => 'Power Output', 'unit_id' => 2, 'tab_num' => 8],
            ['ID' => 9, 'Nama' => 'Efficiency Rating', 'unit_id' => 2, 'tab_num' => 9],
            ['ID' => 10, 'Nama' => 'Emission Level', 'unit_id' => 2, 'tab_num' => 10],
            ['ID' => 11, 'Nama' => 'Turbine Speed', 'unit_id' => 1, 'tab_num' => 1],
            ['ID' => 12, 'Nama' => 'Generator Load', 'unit_id' => 1, 'tab_num' => 2],
            ['ID' => 13, 'Nama' => 'Cooling Water Flow', 'unit_id' => 1, 'tab_num' => 3],
            ['ID' => 14, 'Nama' => 'Vibration Level', 'unit_id' => 1, 'tab_num' => 4],
            ['ID' => 15, 'Nama' => 'Oil Pressure', 'unit_id' => 1, 'tab_num' => 5],
            ['ID' => 16, 'Nama' => 'Bearing Temperature', 'unit_id' => 1, 'tab_num' => 6],
            ['ID' => 17, 'Nama' => 'Electrical Output', 'unit_id' => 1, 'tab_num' => 7],
            ['ID' => 18, 'Nama' => 'Frequency Control', 'unit_id' => 1, 'tab_num' => 8],
            ['ID' => 19, 'Nama' => 'Condenser Vacuum', 'unit_id' => 3, 'tab_num' => 1],
            ['ID' => 20, 'Nama' => 'Feed Water Flow', 'unit_id' => 3, 'tab_num' => 2],
            ['ID' => 21, 'Nama' => 'Ash Content', 'unit_id' => 3, 'tab_num' => 3],
            ['ID' => 22, 'Nama' => 'Stack Temperature', 'unit_id' => 3, 'tab_num' => 4],
            ['ID' => 23, 'Nama' => 'Air Flow Rate', 'unit_id' => 3, 'tab_num' => 5],
            ['ID' => 24, 'Nama' => 'Oxygen Level', 'unit_id' => 3, 'tab_num' => 6],
            ['ID' => 25, 'Nama' => 'Carbon Monoxide', 'unit_id' => 3, 'tab_num' => 7],
            ['ID' => 26, 'Nama' => 'Nitrogen Oxide', 'unit_id' => 3, 'tab_num' => 8],
            ['ID' => 27, 'Nama' => 'Sulfur Dioxide', 'unit_id' => 4, 'tab_num' => 1],
            ['ID' => 28, 'Nama' => 'Particulate Matter', 'unit_id' => 4, 'tab_num' => 2],
            ['ID' => 29, 'Nama' => 'Heat Rate', 'unit_id' => 4, 'tab_num' => 3],
            ['ID' => 30, 'Nama' => 'Thermal Efficiency', 'unit_id' => 4, 'tab_num' => 4],
            ['ID' => 31, 'Nama' => 'Auxiliary Power', 'unit_id' => 4, 'tab_num' => 5],
            ['ID' => 32, 'Nama' => 'Net Output', 'unit_id' => 4, 'tab_num' => 6],
            ['ID' => 33, 'Nama' => 'Gross Output', 'unit_id' => 4, 'tab_num' => 7],
            ['ID' => 34, 'Nama' => 'Station Service', 'unit_id' => 4, 'tab_num' => 8],
        ]);
    }
}
