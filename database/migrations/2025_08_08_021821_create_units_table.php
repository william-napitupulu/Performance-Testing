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
        Schema::create('tb_unit', function (Blueprint $table) {
            $table->smallIncrements('unit_id');
            $table->string('unit_name', 50)->nullable();
            $table->tinyInteger('status')->nullable();
            $table->tinyInteger('plant_id')->unsigned()->nullable();
            $table->integer('tab_manual_aktif')->default(3);

            $table->foreign('plant_id')->references('plant_id')->on('tb_plant')->onDelete('cascade');

            $table->index('status');
            $table->index('plant_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_unit');
    }
};
