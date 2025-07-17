<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get unique tag_no values from tb_input and populate tb_input_tag
        $uniqueTags = DB::table('tb_input')
            ->select('tag_no')
            ->distinct()
            ->get();

        foreach ($uniqueTags as $tag) {
            // Check if tag already exists in tb_input_tag
            $exists = DB::table('tb_input_tag')
                ->where('tag_no', $tag->tag_no)
                ->exists();

            if (!$exists) {
                // Get the unit_id from the performance record that uses this tag
                $performance = DB::table('tb_input')
                    ->join('tb_performance', 'tb_input.perf_id', '=', 'tb_performance.perf_id')
                    ->where('tb_input.tag_no', $tag->tag_no)
                    ->select('tb_performance.unit_id')
                    ->first();

                $unitId = $performance ? $performance->unit_id : 2; // Default to unit 2 if not found

                DB::table('tb_input_tag')->insert([
                    'tag_no' => $tag->tag_no,
                    'address_no' => null,
                    'description' => 'Auto-generated tag for ' . $tag->tag_no,
                    'satuan' => null,
                    'group_id' => 1, // Default group
                    'unit_id' => $unitId,
                    'urutan' => null,
                    'cell' => null,
                    'm_input' => 0, // Default m_input
                    'jm_input' => 6, // Default jm_input
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove auto-generated entries
        DB::table('tb_input_tag')
            ->where('description', 'like', 'Auto-generated tag for %')
            ->delete();
    }
};
