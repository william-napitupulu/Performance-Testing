<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PerformanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_performance')->insert([
            ['perf_id' => 83, 'description' => 'New table2', 'date_perfomance' => '2025-06-29 15:00:00', 'date_created' => '2025-07-01 08:23:07', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 84, 'description' => 'New Performance Test', 'date_perfomance' => '2025-06-28 15:00:00', 'date_created' => '2025-07-01 08:48:58', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 86, 'description' => 'New Parameter', 'date_perfomance' => '2025-07-01 08:00:00', 'date_created' => '2025-07-02 01:49:12', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 89, 'description' => 'Parameters', 'date_perfomance' => '2025-07-01 10:10:00', 'date_created' => '2025-07-02 02:12:23', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 91, 'description' => 'New Performance Sunday', 'date_perfomance' => '2025-07-01 10:00:00', 'date_created' => '2025-07-02 03:55:15', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 92, 'description' => 'Workflw', 'date_perfomance' => '2025-07-01 11:00:00', 'date_created' => '2025-07-02 04:08:09', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 93, 'description' => 'Perf test on saturday', 'date_perfomance' => '2025-06-28 17:00:00', 'date_created' => '2025-07-02 05:54:15', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 95, 'description' => 'asdasas', 'date_perfomance' => '2025-07-02 13:35:00', 'date_created' => '2025-07-03 06:39:10', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 96, 'description' => 'Working hours', 'date_perfomance' => '2025-07-02 05:10:00', 'date_created' => '2025-07-03 07:15:05', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 98, 'description' => 'Kilotests', 'date_perfomance' => '2025-07-02 13:00:00', 'date_created' => '2025-07-04 07:17:17', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 99, 'description' => 'Background test', 'date_perfomance' => '2025-07-01 14:00:00', 'date_created' => '2025-07-04 07:33:41', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 100, 'description' => 'Anomaly', 'date_perfomance' => '2025-07-02 14:40:00', 'date_created' => '2025-07-04 07:44:58', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 101, 'description' => 'New Test', 'date_perfomance' => '2025-07-01 10:00:00', 'date_created' => '2025-07-04 08:50:29', 'status' => 1, 'unit_id' => 3, 'type' => null, 'weight' => null],
            ['perf_id' => 102, 'description' => 'Descrip', 'date_perfomance' => '2025-07-02 11:15:00', 'date_created' => '2025-07-04 09:16:27', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 103, 'description' => 'New data', 'date_perfomance' => '2025-07-06 13:55:00', 'date_created' => '2025-07-08 06:55:34', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 105, 'description' => 'tesr', 'date_perfomance' => '2025-07-07 09:00:00', 'date_created' => '2025-07-09 02:02:43', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 106, 'description' => 'new work', 'date_perfomance' => '2025-07-08 10:35:00', 'date_created' => '2025-07-09 03:36:42', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 107, 'description' => 'working rest', 'date_perfomance' => '2025-07-08 10:35:00', 'date_created' => '2025-07-09 03:38:41', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 108, 'description' => 'wrwrwr', 'date_perfomance' => '2025-07-07 10:35:00', 'date_created' => '2025-07-09 03:39:24', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 109, 'description' => 'lets work', 'date_perfomance' => '2025-07-08 10:40:00', 'date_created' => '2025-07-09 03:40:08', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 110, 'description' => 'wewrr', 'date_perfomance' => '2025-07-07 10:40:00', 'date_created' => '2025-07-09 03:40:23', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 118, 'description' => 'New Test in July', 'date_perfomance' => '2025-07-08 15:05:00', 'date_created' => '2025-07-16 08:07:48', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 119, 'description' => 'Ne test', 'date_perfomance' => '2025-07-07 15:05:00', 'date_created' => '2025-07-16 08:08:36', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 121, 'description' => 'New work', 'date_perfomance' => '2025-07-02 09:00:00', 'date_created' => '2025-07-17 02:01:33', 'status' => 1, 'unit_id' => 2, 'type' => null, 'weight' => null],
            ['perf_id' => 124, 'description' => 'August test', 'date_perfomance' => '2025-07-15 12:00:00', 'date_created' => '2025-07-17 05:59:30', 'status' => 1, 'unit_id' => 2, 'type' => 'Rutin', 'weight' => 'Beban 2'],
            ['perf_id' => 125, 'description' => 'New', 'date_perfomance' => '2025-07-15 16:00:00', 'date_created' => '2025-07-17 09:02:49', 'status' => 1, 'unit_id' => 2, 'type' => 'Rutin', 'weight' => 'Beban 2'],
            ['perf_id' => 128, 'description' => 'Another Training test', 'date_perfomance' => '2025-07-01 15:55:00', 'date_created' => '2025-07-18 08:56:51', 'status' => 1, 'unit_id' => 2, 'type' => 'Sebelum OH', 'weight' => 'Beban 1'],
            ['perf_id' => 129, 'description' => 'aasdf', 'date_perfomance' => '2025-07-16 16:00:00', 'date_created' => '2025-07-18 09:02:23', 'status' => 1, 'unit_id' => 2, 'type' => 'Rutin', 'weight' => 'Beban 1'],
            ['perf_id' => 130, 'description' => 'ghghg', 'date_perfomance' => '2025-07-16 16:05:00', 'date_created' => '2025-07-18 09:05:06', 'status' => 1, 'unit_id' => 2, 'type' => 'Sebelum OH', 'weight' => 'Beban 1'],
            ['perf_id' => 133, 'description' => 'Nes', 'date_perfomance' => '2025-07-08 09:25:00', 'date_created' => '2025-07-24 02:28:17', 'status' => 1, 'unit_id' => 2, 'type' => 'Sebelum OH', 'weight' => 'Beban 2'],
            ['perf_id' => 134, 'description' => 'BReaker test', 'date_perfomance' => '2025-07-22 10:05:00', 'date_created' => '2025-07-24 03:05:22', 'status' => 1, 'unit_id' => 2, 'type' => 'Sebelum OH', 'weight' => 'Beban 2'],
            ['perf_id' => 136, 'description' => 'new list of data', 'date_perfomance' => '2025-07-15 10:45:00', 'date_created' => '2025-07-24 03:49:21', 'status' => 1, 'unit_id' => 2, 'type' => 'Paska OH', 'weight' => 'Beban 2'],
            ['perf_id' => 140, 'description' => 'TES99999', 'date_perfomance' => '2025-07-23 15:35:00', 'date_created' => '2025-07-24 08:37:47', 'status' => 1, 'unit_id' => 2, 'type' => 'Rutin', 'weight' => 'Beban 1'],
            ['perf_id' => 141, 'description' => 'new test', 'date_perfomance' => '2025-07-15 15:45:00', 'date_created' => '2025-07-24 08:45:16', 'status' => 1, 'unit_id' => 2, 'type' => 'Sebelum OH', 'weight' => 'Beban 2'],
            ['perf_id' => 142, 'description' => 'Even newer test', 'date_perfomance' => '2025-07-23 15:30:00', 'date_created' => '2025-07-24 08:50:41', 'status' => 1, 'unit_id' => 2, 'type' => 'Sebelum OH', 'weight' => 'Beban 1'],
            ['perf_id' => 143, 'description' => 'Final Test', 'date_perfomance' => '2025-08-03 12:55:00', 'date_created' => '2025-08-04 05:55:40', 'status' => 1, 'unit_id' => 2, 'type' => 'Rutin', 'weight' => 'Beban 2'],
            ['perf_id' => 144, 'description' => 'New Day', 'date_perfomance' => '2025-08-03 12:55:00', 'date_created' => '2025-08-04 05:57:08', 'status' => 1, 'unit_id' => 2, 'type' => 'Rutin', 'weight' => 'Beban 1'],
            ['perf_id' => 145, 'description' => 'erewrsd', 'date_perfomance' => '2025-08-03 14:40:00', 'date_created' => '2025-08-04 07:43:04', 'status' => 1, 'unit_id' => 2, 'type' => 'Sebelum OH', 'weight' => 'Beban 2'],
        ]);
    }
}
