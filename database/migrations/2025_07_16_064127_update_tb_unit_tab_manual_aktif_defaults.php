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
        // Check if the column exists
        if (!Schema::hasColumn('tb_unit', 'tab_manual_aktif')) {
            Schema::table('tb_unit', function (Blueprint $table) {
                $table->integer('tab_manual_aktif')->default(3)->after('status');
            });
        }

        // Update any NULL values to default to 3
        DB::table('tb_unit')
            ->whereNull('tab_manual_aktif')
            ->update(['tab_manual_aktif' => 3]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('tb_unit', 'tab_manual_aktif')) {
            Schema::table('tb_unit', function (Blueprint $table) {
                $table->dropColumn('tab_manual_aktif');
            });
        }
    }
};
