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
        // Fix collation for tb_input_tag.tag_no column
        DB::statement('ALTER TABLE tb_input_tag MODIFY tag_no VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL');
        
        // Fix collation for tb_input.tag_no column
        DB::statement('ALTER TABLE tb_input MODIFY tag_no VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert tb_input_tag.tag_no column to original collation
        DB::statement('ALTER TABLE tb_input_tag MODIFY tag_no VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL');
        
        // Revert tb_input.tag_no column to original collation
        DB::statement('ALTER TABLE tb_input MODIFY tag_no VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL');
    }
};
