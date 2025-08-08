<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InputGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_input_group')->insert([
            ['group_id' => 1, 'sheet' => 'dcs1', 'keterangan' => 'data dari EDS 1', 'unit_id' => 2],
            ['group_id' => 2, 'sheet' => 'dcs2', 'keterangan' => 'data dari EDS 2', 'unit_id' => 2],
            ['group_id' => 3, 'sheet' => 'dcs3', 'keterangan' => 'data dari EDS 3', 'unit_id' => 2],
            ['group_id' => 4, 'sheet' => 'dcs4', 'keterangan' => 'data dari EDS 4', 'unit_id' => 2],
            ['group_id' => 5, 'sheet' => 'Break Loss Raw', 'keterangan' => 'data dari OIS1', 'unit_id' => 2],
        ]);
    }
}
