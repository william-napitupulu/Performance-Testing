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
        Schema::create('tb_input_group', function (Blueprint $table) {
            $table->tinyIncrements('group_id');
            $table->string('sheet', 50)->nullable();
            $table->string('keterangan', 255)->nullable();
            $table->smallInteger('unit_id')->unsigned()->nullable();

            $table->foreign('unit_id')
                  ->references('unit_id')
                  ->on('tb_unit')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_input_group');
    }
};
