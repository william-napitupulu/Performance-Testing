<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pt.tb_trending_template', function (Blueprint $table) {
            $table->id(); // or $table->increments('id');
            $table->string('name'); // e.g., "HHV vs Heatrate"
            $table->string('description')->nullable();
            $table->unsignedBigInteger('unit_id')->nullable(); // If templates are unit-specific
            $table->timestamps();
        });

        // 2. The Pivot Table (Links Templates to Output Tags)
        Schema::create('pt.tb_trending_template_detail', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('template_id');
            $table->unsignedBigInteger('output_id'); // Foreign key to tb_output_tag
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pt.tb_trending_template_detail');
        Schema::dropIfExists('pt.tb_trending_template');
    }
};
